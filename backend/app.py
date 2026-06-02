import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sqlalchemy.exc import IntegrityError
from models import db, User, Assessment, slugify
from ecosystem_routes import eco
from coach_routes import coach_bp
from notifications_routes import noti_bp
from messages_routes import msg_bp
from db_migrate import migrate_database
from ai_modules.situp_analyzer import analyze_situps
from ai_modules.jump_analyzer import analyze_jump
from ai_modules.shuttle_analyzer import analyze_shuttle
from ai_modules.sprint_analyzer import analyze_sprint
from auth_utils import issue_token
from email_service import send_email
from comms_service import create_notification
from flask_socketio import SocketIO
from socket_events import register_socket_handlers

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sports.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
AVATAR_FOLDER = os.path.join(UPLOAD_FOLDER, 'avatars')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AVATAR_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['AVATAR_FOLDER'] = AVATAR_FOLDER
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

db.init_app(app)

with app.app_context():
    db.create_all()
    uri = app.config['SQLALCHEMY_DATABASE_URI']
    if uri.startswith('sqlite:///'):
        db_path = uri.replace('sqlite:///', '')
        if not os.path.isabs(db_path):
            for candidate in (
                os.path.join(os.path.dirname(__file__), db_path),
                os.path.join(os.path.dirname(__file__), 'instance', db_path),
            ):
                if os.path.exists(candidate):
                    db_path = candidate
                    break
            else:
                db_path = os.path.join(os.path.dirname(__file__), db_path)
        migrate_database(db_path)
    from seed_ecosystem import seed_ecosystem
    seed_ecosystem()

app.register_blueprint(eco)
app.register_blueprint(coach_bp)
app.register_blueprint(noti_bp)
app.register_blueprint(msg_bp)
register_socket_handlers(socketio)


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'ok': True, 'service': 'sportsgauge-api'})


def user_to_dict(user):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "age": user.age,
        "gender": user.gender,
        "email": user.email,
        "mobile_number": user.mobile_number,
        "state": user.state,
        "district": user.district,
        "sports_interest": user.sports_interest,
        "height": user.height,
        "weight": user.weight,
        "bio": user.bio or "",
        "profile_photo": user.profile_photo,
        "role": user.role,
        "username": user.username,
        "is_verified": user.is_verified,
        "badges": user.badges or "",
    }

def allowed_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    try:
        new_user = User(
            full_name=data['full_name'],
            age=data['age'],
            gender=data['gender'],
            mobile_number=data['mobile_number'],
            email=data['email'],
            password_hash=data['password'], # In production, hash this!
            state=data['state'],
            district=data['district'],
            sports_interest=data['sports_interest'],
            height=data['height'],
            weight=data['weight']
        )
        base_username = slugify(data['full_name'])
        username = base_username
        n = 1
        while User.query.filter_by(username=username).first():
            username = f'{base_username}-{n}'
            n += 1
        new_user.username = username
        db.session.add(new_user)
        db.session.commit()
        create_notification(
            'athlete', new_user.id,
            'Welcome to SportsGauge',
            'Your account has been created successfully. Start your first AI assessment.',
            ntype='platform', category='platform',
        )
        send_email(new_user.email, 'welcome', {'name': new_user.full_name})
        send_email(new_user.email, 'verification', {'name': new_user.full_name})
        send_email(new_user.email, 'registration_success', {'name': new_user.full_name})
        return jsonify({"success": True, "message": "Registered successfully", "user_id": new_user.id, "username": username})
    except IntegrityError:
        db.session.rollback()
        return jsonify({"success": False, "error": "This email is already registered. Please sign in instead."}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email'], password_hash=data['password']).first()
    if user:
        token = issue_token("athlete", user.id, user.full_name, user.role or "athlete")
        return jsonify({"success": True, "user_id": user.id, "role": user.role, "name": user.full_name, "access_token": token})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401


@app.route('/api/auth/password/request-reset', methods=['POST'])
def request_password_reset():
    data = request.json or {}
    email = (data.get('email') or '').strip().lower()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": True, "message": "If this email exists, a reset link has been sent."})
    reset_link = f"http://localhost:5173/reset-password?email={email}"
    send_email(user.email, 'password_reset_link', {"name": user.full_name, "reset_link": reset_link})
    create_notification(
        'athlete', user.id, 'Password reset requested',
        'A password reset link was generated for your account.',
        ntype='platform', category='platform',
    )
    return jsonify({"success": True, "message": "Reset link sent"})


@app.route('/api/auth/password/change', methods=['POST'])
def change_password():
    data = request.json or {}
    email = (data.get('email') or '').strip().lower()
    old_password = data.get('old_password')
    new_password = data.get('new_password')
    if not email or not new_password:
        return jsonify({"success": False, "error": "Email and new password required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    if old_password and user.password_hash != old_password:
        return jsonify({"success": False, "error": "Old password mismatch"}), 400
    user.password_hash = new_password
    db.session.commit()
    send_email(user.email, 'password_changed_notification', {"name": user.full_name})
    create_notification(
        'athlete', user.id, 'Password changed',
        'Your account password was changed successfully.',
        ntype='platform', category='platform',
    )
    return jsonify({"success": True})

@app.route('/api/user/<int:user_id>', methods=['GET', 'PUT'])
def user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if request.method == 'GET':
        return jsonify(user_to_dict(user))

    data = request.json or {}
    for field in ('full_name', 'age', 'gender', 'state', 'district', 'sports_interest', 'height', 'weight', 'bio'):
        if field in data and data[field] is not None and data[field] != '':
            if field in ('age',):
                setattr(user, field, int(data[field]))
            elif field in ('height', 'weight'):
                setattr(user, field, float(data[field]))
            else:
                setattr(user, field, data[field])
    try:
        db.session.commit()
        return jsonify({"success": True, "user": user_to_dict(user)})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 400

@app.route('/api/user/<int:user_id>/avatar', methods=['POST'])
def upload_avatar(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    if 'photo' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    file = request.files['photo']
    if file.filename == '' or not allowed_image(file.filename):
        return jsonify({"error": "Invalid image. Use JPG, PNG, or WEBP."}), 400
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = secure_filename(f"user_{user_id}.{ext}")
    filepath = os.path.join(app.config['AVATAR_FOLDER'], filename)
    file.save(filepath)
    user.profile_photo = filename
    db.session.commit()
    return jsonify({
        "success": True,
        "profile_photo": filename,
        "avatar_url": f"http://127.0.0.1:5000/api/user/{user_id}/avatar/file"
    })

@app.route('/api/user/<int:user_id>/avatar/file', methods=['GET'])
def serve_avatar(user_id):
    user = User.query.get(user_id)
    if not user or not user.profile_photo:
        return jsonify({"error": "No avatar"}), 404
    return send_from_directory(app.config['AVATAR_FOLDER'], user.profile_photo)

@app.route('/api/uploads/<filename>', methods=['GET'])
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/analyze/<test_name>', methods=['POST'])
def analyze_video(test_name):
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
    
    file = request.files['video']
    user_id = request.form.get('user_id')
    user = User.query.get(user_id) if user_id else None
    if user:
        create_notification(
            'athlete', user.id, 'Assessment started',
            f'Your {test_name} assessment has started processing.',
            ntype='assessment', category='assessment',
        )
        send_email(user.email, 'assessment_started', {'name': user.full_name, 'test_name': test_name})
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    # Process AI
    result = {}
    if test_name == 'situp':
        result = analyze_situps(filepath)
    elif test_name == 'jump':
        # fetch user height
        height = user.height if user else 170.0
        result = analyze_jump(filepath, user_height_cm=height)
    elif test_name == 'shuttle':
        result = analyze_shuttle(filepath)
    elif test_name == 'sprint':
        result = analyze_sprint(filepath)
    else:
        return jsonify({"error": "Unknown test"}), 400
        
    if "error" in result:
        return jsonify(result), 500

    # Save Assessment to DB
    if user_id:
        assessment = Assessment(
            user_id=user_id,
            test_name=test_name,
            score=result['score'],
            video_url=filepath,
            ai_confidence=result['ai_confidence'],
            validation_status=result['validation_status'],
            cheat_reason=result['cheat_reason']
        )
        db.session.add(assessment)
        db.session.commit()
        if user:
            create_notification(
                'athlete', user.id, 'Assessment completed',
                f'Your {test_name} assessment has been completed.',
                ntype='assessment', category='assessment',
            )
            send_email(user.email, 'assessment_completed', {'name': user.full_name, 'test_name': test_name})
        try:
            from ai_recommendations import generate_recommendations
            from models import AIRecommendation
            u = User.query.get(user_id)
            all_a = Assessment.query.filter_by(user_id=user_id).all()
            data = generate_recommendations(u, all_a)
            rec = AIRecommendation.query.filter_by(user_id=user_id).first()
            if not rec:
                rec = AIRecommendation(user_id=user_id, **data)
                db.session.add(rec)
            else:
                for k, v in data.items():
                    setattr(rec, k, v)
            db.session.commit()
            if user:
                create_notification(
                    'athlete', user.id, 'AI analysis completed',
                    f'AI analysis for {test_name} is complete. Results are now available.',
                    ntype='assessment', category='assessment',
                )
                create_notification(
                    'athlete', user.id, 'Results available',
                    'Assessment results and recommendations are available in your dashboard.',
                    ntype='assessment', category='assessment',
                )
                send_email(user.email, 'ai_analysis_completed', {'name': user.full_name, 'test_name': test_name})
                send_email(user.email, 'results_available', {'name': user.full_name, 'test_name': test_name})
        except Exception:
            db.session.rollback()
    
    return jsonify(result)

@app.route('/api/assessments/<int:user_id>', methods=['GET'])
def get_assessments(user_id):
    assessments = Assessment.query.filter_by(user_id=user_id).order_by(Assessment.date.desc()).all()
    result = []
    for a in assessments:
        result.append({
            "id": a.id,
            "test_name": a.test_name,
            "score": a.score,
            "date": a.date.isoformat(),
            "ai_confidence": a.ai_confidence,
            "validation_status": a.validation_status,
            "cheat_reason": a.cheat_reason
        })
    return jsonify(result)

@app.route('/api/admin/athletes', methods=['GET'])
def admin_athletes():
    users = User.query.all()
    result = []
    for u in users:
        assessments = Assessment.query.filter_by(user_id=u.id).all()
        result.append({
            "id": u.id,
            "full_name": u.full_name,
            "age": u.age,
            "gender": u.gender,
            "state": u.state,
            "district": u.district,
            "sports_interest": u.sports_interest,
            "assessments": [{
                "test_name": a.test_name,
                "score": a.score,
                "validation_status": a.validation_status,
                "ai_confidence": a.ai_confidence,
                "date": a.date.isoformat()
            } for a in assessments]
        })
    return jsonify(result)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='127.0.0.1', port=5000, allow_unsafe_werkzeug=True)
