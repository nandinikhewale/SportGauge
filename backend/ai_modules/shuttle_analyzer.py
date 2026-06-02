import cv2
import mediapipe as mp

def analyze_shuttle(video_path):
    """
    Analyzes shuttle run.
    Counts direction changes to ensure they did the shuttles.
    Score is the time taken to complete the shuttles.
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

    direction_changes = 0
    last_x = None
    current_direction = None # 'left' or 'right'
    
    cheat_status = "Valid"
    cheat_reason = ""

    valid_frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(frame_rgb)
        
        if not results.pose_landmarks:
            continue
            
        valid_frames += 1
        lm = results.pose_landmarks.landmark
        
        # Track torso center x
        left_shoulder = lm[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
        right_shoulder = lm[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
        center_x = (left_shoulder.x + right_shoulder.x) / 2
        
        if last_x is not None:
            # simple hysteresis
            diff = center_x - last_x
            if abs(diff) > 0.05: # moved 5% of screen
                new_dir = 'right' if diff > 0 else 'left'
                if current_direction and new_dir != current_direction:
                    direction_changes += 1
                current_direction = new_dir
                last_x = center_x
        else:
            last_x = center_x

    cap.release()
    pose.close()

    if direction_changes < 3: # Assuming 10x4m shuttle (3 turns)
        cheat_status = "Rejected"
        cheat_reason = f"Only detected {direction_changes} turns. Ensure full frame is visible."

    confidence = 100 * (valid_frames / total_frames) if total_frames > 0 else 0

    return {
        "score": round(duration, 2), # seconds
        "ai_confidence": round(confidence, 2),
        "validation_status": cheat_status,
        "cheat_reason": cheat_reason
    }
