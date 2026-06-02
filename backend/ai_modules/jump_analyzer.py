import cv2
import mediapipe as mp
import numpy as np
import os

def calculate_px_per_cm(landmarks, h, user_height_cm):
    mp_pose = mp.solutions.pose
    try:
        head = landmarks[mp_pose.PoseLandmark.NOSE.value]
        left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
        right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
        ankle_y = max(left_ankle.y, right_ankle.y) * h
        head_y = head.y * h
        px_height = abs(ankle_y - head_y)
        px_per_cm = px_height / user_height_cm
        return px_per_cm, ankle_y
    except Exception:
        return None, None

def analyze_jump(video_path, user_height_cm=170.0):
    mp_pose = mp.solutions.pose
    mp_drawing = mp.solutions.drawing_utils
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    max_jump_height = 0.0
    px_per_cm = None
    standing_hip_y = None
    
    cheat_status = "Valid"
    cheat_reason = ""
    total_frames = 0
    frames_not_fully_visible = 0

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0: fps = 30
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    dir_name = os.path.dirname(video_path)
    base_name = os.path.basename(video_path)
    debug_filename = "debug_" + os.path.splitext(base_name)[0] + ".webm"
    debug_path = os.path.join(dir_name, debug_filename)
    fourcc = cv2.VideoWriter_fourcc(*'vp80')
    out = cv2.VideoWriter(debug_path, fourcc, fps, (width, height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        total_frames += 1
        h, w = frame.shape[:2]
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)
        
        current_conf = 100 - (frames_not_fully_visible / total_frames * 100) if total_frames > 0 else 0
        
        if not results.pose_landmarks:
            frames_not_fully_visible += 1
            cv2.putText(frame, "WARNING: No Pose Detected", (10, 230), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            mp_drawing.draw_landmarks(
                frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2)
            )
            
            lm = results.pose_landmarks.landmark
            
            if px_per_cm is None:
                px_per_cm, _ = calculate_px_per_cm(lm, h, user_height_cm)
                if px_per_cm:
                    left_hip = lm[mp_pose.PoseLandmark.LEFT_HIP.value]
                    right_hip = lm[mp_pose.PoseLandmark.RIGHT_HIP.value]
                    standing_hip_y = ((left_hip.y + right_hip.y) / 2) * h
            else:
                left_hip = lm[mp_pose.PoseLandmark.LEFT_HIP.value]
                right_hip = lm[mp_pose.PoseLandmark.RIGHT_HIP.value]
                
                if left_hip.visibility >= 0.5 or right_hip.visibility >= 0.5:
                    current_hip_y_px = ((left_hip.y + right_hip.y) / 2) * h
                    if current_hip_y_px < standing_hip_y - 10: # Jumped
                        jump_height_px = standing_hip_y - current_hip_y_px
                        jump_height_cm = jump_height_px / px_per_cm
                        if jump_height_cm > max_jump_height:
                            max_jump_height = jump_height_cm
                else:
                    frames_not_fully_visible += 1
                    cv2.putText(frame, "WARNING: Hips Not Visible", (10, 230), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

        cv2.putText(frame, f"Stand Hip Y: {int(standing_hip_y) if standing_hip_y else 'N/A'}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Max Jump: {round(max_jump_height, 2)} cm", (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Conf: {int(current_conf)}%", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        out.write(frame)

    cap.release()
    out.release()
    pose.close()

    if total_frames > 0 and frames_not_fully_visible / total_frames > 0.4:
        cheat_status = "Rejected"
        cheat_reason = "Body not fully visible."

    confidence = max(0, 100 - (frames_not_fully_visible / total_frames * 100)) if total_frames > 0 else 0

    return {
        "score": round(max_jump_height, 2),
        "ai_confidence": round(confidence, 2),
        "validation_status": cheat_status,
        "cheat_reason": cheat_reason,
        "debug_video_url": f"/api/uploads/{debug_filename}"
    }
