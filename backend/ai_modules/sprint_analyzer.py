import cv2
import mediapipe as mp

def analyze_sprint(video_path):
    """
    Analyzes a sprint.
    Score is simply the duration of active running in the video.
    """
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps if fps > 0 else 0
    
    cheat_status = "Valid"
    cheat_reason = ""
    valid_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)
        
        if results.pose_landmarks:
            valid_frames += 1

    cap.release()
    pose.close()

    confidence = 100 * (valid_frames / total_frames) if total_frames > 0 else 0
    
    if confidence < 50:
        cheat_status = "Rejected"
        cheat_reason = "Athlete not clearly visible during sprint."

    return {
        "score": round(duration, 2), # seconds
        "ai_confidence": round(confidence, 2),
        "validation_status": cheat_status,
        "cheat_reason": cheat_reason
    }
