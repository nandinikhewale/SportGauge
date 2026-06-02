import cv2
import mediapipe as mp
import numpy as np
import os

def get_angle(a, b, c):
    """Calculate angle between three points"""
    ba = np.array([a.x - b.x, a.y - b.y])
    bc = np.array([c.x - b.x, c.y - b.y])
    norm_ba = np.linalg.norm(ba)
    norm_bc = np.linalg.norm(bc)
    if norm_ba == 0 or norm_bc == 0:
        return 180.0
    cosine_angle = np.dot(ba, bc) / (norm_ba * norm_bc)
    return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

def analyze_situps(video_path):
    """
    Analyzes a recorded video for sit-ups.
    Returns a dictionary with count, cheat_status, reason, and debug video path.
    """
    mp_pose = mp.solutions.pose
    mp_drawing = mp.solutions.drawing_utils
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    situp_count = 0
    current_stage = "down"
    smoothed_angle = 180.0
    
    cheat_status = "Valid"
    cheat_reason = ""
    
    fallback_baseline = None
    
    # Cheat detection variables
    frames_no_face = 0
    total_frames = 0
    frames_not_fully_visible = 0

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30 # default
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    dir_name = os.path.dirname(video_path)
    base_name = os.path.basename(video_path)
    debug_filename = "debug_" + os.path.splitext(base_name)[0] + ".webm"
    debug_path = os.path.join(dir_name, debug_filename)
    # Use VP8 codec for webm which is browser compatible
    fourcc = cv2.VideoWriter_fourcc(*'vp80')
    out = cv2.VideoWriter(debug_path, fourcc, fps, (width, height))
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        total_frames += 1
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)
        
        current_conf = 100 - (frames_not_fully_visible / total_frames * 100) if total_frames > 0 else 0
        
        if not results.pose_landmarks:
            frames_not_fully_visible += 1
            cv2.putText(frame, "WARNING: No Pose Detected", (10, 230), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            # If completely out of frame, assume they lay down
            if current_stage == "up":
                situp_count += 1
                current_stage = "down"
        else:
            # Draw Skeleton
            mp_drawing.draw_landmarks(
                frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2)
            )
            
            lm = results.pose_landmarks.landmark
            
            # Check face visibility (cheat detection)
            nose = lm[mp_pose.PoseLandmark.NOSE.value]
            if nose.visibility < 0.5:
                frames_no_face += 1
                if current_stage == "up":
                    situp_count += 1
                    current_stage = "down"

            # Check which side is more visible
            left_hip_vis = lm[mp_pose.PoseLandmark.LEFT_HIP.value].visibility
            right_hip_vis = lm[mp_pose.PoseLandmark.RIGHT_HIP.value].visibility
            
            if left_hip_vis > right_hip_vis:
                shoulder = lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
                hip = lm[mp_pose.PoseLandmark.LEFT_HIP.value]
                knee = lm[mp_pose.PoseLandmark.LEFT_KNEE.value]
            else:
                shoulder = lm[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
                hip = lm[mp_pose.PoseLandmark.RIGHT_HIP.value]
                knee = lm[mp_pose.PoseLandmark.RIGHT_KNEE.value]
                
            # If main joints not visible
            if shoulder.visibility < 0.5 or hip.visibility < 0.5 or knee.visibility < 0.5:
                frames_not_fully_visible += 1
                cv2.putText(frame, "WARNING: Joints Not Fully Visible", (10, 230), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                
                # Fallback logic: Track nose Y coordinate if full body isn't visible
                if nose.visibility > 0.5:
                    nose_y = nose.y * height
                    if fallback_baseline is None:
                        fallback_baseline = nose_y
                    
                    if current_stage == "down":
                        # Self-calibrate: if they go lower (higher Y), update baseline
                        if nose_y > fallback_baseline:
                            fallback_baseline = nose_y
                        
                        # If nose moves UP (lower Y) significantly, they are sitting up
                        if nose_y < fallback_baseline - (height * 0.10):
                            current_stage = "up"
                            fallback_baseline = nose_y
                            
                    elif current_stage == "up":
                        # Self-calibrate: if they go higher (lower Y), update baseline
                        if nose_y < fallback_baseline:
                            fallback_baseline = nose_y
                            
                        # If nose moves DOWN (higher Y) significantly, they are lying down
                        if nose_y > fallback_baseline + (height * 0.10):
                            situp_count += 1
                            current_stage = "down"
                            fallback_baseline = nose_y
            else:
                # Standard angle logic
                sh_hip_knee_angle = get_angle(shoulder, hip, knee)
                smoothed_angle = 0.7 * smoothed_angle + 0.3 * sh_hip_knee_angle
                
                # Logic: Down -> Up (< 85 is more forgiving than 60) -> Down (> 140)
                if current_stage == "down":
                    if smoothed_angle < 85:
                        current_stage = "up"
                elif current_stage == "up":
                    if smoothed_angle > 140:
                        situp_count += 1
                        current_stage = "down"

        cv2.putText(frame, f"Angle: {int(smoothed_angle)}", (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Stage: {current_stage}", (10, 80), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Count: {situp_count}", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        cv2.putText(frame, f"Conf: {int(current_conf)}%", (10, 160), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
        
        # Log to debug video
        out.write(frame)

    cap.release()
    out.release()
    pose.close()

    # Cheat Detection Logic
    if total_frames > 0:
        if frames_no_face / total_frames > 0.3:
            cheat_status = "Rejected"
            cheat_reason = "Face not visible for a large portion of the video."
        elif frames_not_fully_visible / total_frames > 0.3:
            cheat_status = "Rejected"
            cheat_reason = "Body not fully visible."

    # Confidence based on visibility and valid frames
    confidence = max(0, 100 - (frames_not_fully_visible / total_frames * 100)) if total_frames > 0 else 0

    return {
        "score": situp_count,
        "ai_confidence": round(confidence, 2),
        "validation_status": cheat_status,
        "cheat_reason": cheat_reason,
        "debug_video_url": f"/api/uploads/{debug_filename}"
    }
