# SportsGauge Unified Platform

This project integrates the React frontend and the MediaPipe Python AI backend into a single production-ready sports talent assessment platform.

## Folder Structure
- `/backend`: Flask + SQLAlchemy backend with OpenCV/MediaPipe AI processors.
- `/FrontEnd-sportsgauge-capstone-project-main`: React frontend using Vite and Tailwind CSS.

## Deployment Steps

### Backend Setup
1. Navigate to `/backend`.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `python app.py`. The server will start on `http://127.0.0.1:5000` and automatically initialize the SQLite `sports.db`.

### Frontend Setup
1. Navigate to `/FrontEnd-sportsgauge-capstone-project-main`.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the web platform at the localhost URL provided by Vite.

## Testing Guide
1. **Home Page**: Navigate to `/`. Ensure the new Landing Page loads with the new Khelo India aesthetic.
2. **Registration**: Click "Register" in the Navbar. Fill out the form with your demographic data (height and weight are important for AI calculations) and submit. You will be redirected to the Dashboard.
3. **Dashboard**: Navigate to `/tests`. View your BMI, Profile Card, and Analytics Chart.
4. **Assessment Recording**: Click on an available test (e.g., Sit Ups) on the Dashboard. Ensure camera permissions are granted. Click "Turn On Camera", then "Start Recording". Perform the test in view of the camera, then click "Stop Recording".
5. **AI Analysis**: Click "Analyze Video". The frontend will upload the `.webm` video to the backend. The backend processes the video frame-by-frame using MediaPipe to calculate your score, confidence, and validation status (Cheat Detection). The result is returned and displayed on the Score Card.
6. **Admin Panel**: Navigate to `/admin` to view the master dashboard of all athletes, their locations, and their assessment histories. Test the filtering by State, Gender, or Sport.

## AI Integration Architecture
- The backend replaces the old webcam feed with offline video processing.
- The `UploadCenter.jsx` uses `navigator.mediaDevices.getUserMedia` and `MediaRecorder` to create a `webm` blob from the user's camera.
- The blob is uploaded to `POST /api/analyze/<test_name>`.
- The corresponding `analyzer` in `/backend/ai_modules/` processes the video via `cv2.VideoCapture` and returns the repetitions, time, and anti-cheat validation status.
- Results are saved to `Assessment` table and rendered on the frontend.
