import os
from flask import Flask, jsonify, request
from models import db, Posting, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from models import db, Posting, User, Application

app = Flask(__name__)
CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'portal.db')
db.init_app(app)
bcrypt = Bcrypt(app)
app.config['JWT_SECRET_KEY'] = 'change-this-to-a-random-secret-later' 
jwt = JWTManager(app)

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return jsonify({"message": "API is running"})

@app.route('/postings', methods=['POST'])
@jwt_required()
def create_posting():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    new_posting = Posting(
        title=data['title'],
        description=data['description'],
        requirements=data.get('requirements', ''),
        company_name=data['company_name'],
        posted_by=current_user_id
    )
    db.session.add(new_posting)
    db.session.commit()
    return jsonify({"message": "Posting created", "id": new_posting.id}), 201

@app.route('/postings', methods=['GET']) 
def get_postings(): 
    postings = Posting.query.all() 
    result = [] 
    for p in postings: 
        result.append({ 
            "id": p.id, 
            "title": p.title, 
            "description": p.description, 
            "company_name": p.company_name, 
            "status": p.status 
        }) 
    return jsonify(result)

@app.route('/postings/<int:posting_id>', methods=['GET'])
def get_posting(posting_id):
    p = Posting.query.get_or_404(posting_id)
    return jsonify({
        "id": p.id,
        "title": p.title,
        "description": p.description,
        "requirements": p.requirements,
        "company_name": p.company_name,
        "status": p.status
    })

@app.route('/postings/<int:posting_id>', methods=['PUT'])
@jwt_required()
def update_posting(posting_id):
    current_user_id = get_jwt_identity()
    p = Posting.query.get_or_404(posting_id)
    if str(p.posted_by) != current_user_id:
        return jsonify({"error": "Not authorized to edit this posting"}), 403
    data = request.get_json()
    p.title = data.get('title', p.title)
    p.description = data.get('description', p.description)
    p.requirements = data.get('requirements', p.requirements)
    p.company_name = data.get('company_name', p.company_name)
    p.status = data.get('status', p.status)
    db.session.commit()
    return jsonify({"message": "Posting updated"})

@app.route('/postings/<int:posting_id>', methods=['DELETE'])
@jwt_required() 
def delete_posting(posting_id): 
    current_user_id = get_jwt_identity()
    p = Posting.query.get_or_404(posting_id) 
    if str(p.posted_by) != current_user_id:
        return jsonify({"error": "Not authorized to delete this posting"}), 403
    db.session.delete(p) 
    db.session.commit() 
    return jsonify({"message": "Posting deleted"})

@app.route('/register', methods=['POST']) 
def register(): 
    data = request.get_json() 
    existing_user = User.query.filter_by(email=data['email']).first() 
    if existing_user: 
        return jsonify({"error": "Email already registered"}), 409 

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8') 
    new_user = User( 
        name=data['name'], 
        email=data['email'], 
        password_hash=hashed_password, 
        role=data['role'] 
    ) 

    db.session.add(new_user) 
    db.session.commit() 
    return jsonify({"message": "User registered", "id": new_user.id}), 201

@app.route('/login', methods=['POST']) 
def login(): 
    data = request.get_json() 
    user = User.query.filter_by(email=data['email']).first() 
    if not user or not bcrypt.check_password_hash(user.password_hash, data['password']): 
        return jsonify({"error": "Invalid email or password"}), 401 
    access_token = create_access_token(identity=str(user.id)) 
    return jsonify({ 
        "message": "Login successful", 
        "access_token": access_token, 
        "user_id": user.id, 
        "role": user.role 
    })

@app.route('/applications', methods=['POST'])
@jwt_required()
def apply_to_posting():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    posting_id = data['posting_id']

    existing = Application.query.filter_by(student_id=current_user_id, posting_id=posting_id).first()
    if existing:
        return jsonify({"error": "You already applied to this posting"}), 409

    new_application = Application(
        student_id=current_user_id,
        posting_id=posting_id
    )
    db.session.add(new_application)
    db.session.commit()
    return jsonify({"message": "Application submitted", "id": new_application.id}), 201

@app.route('/my-applications', methods=['GET'])
@jwt_required()
def my_applications():
    current_user_id = get_jwt_identity()
    applications = Application.query.filter_by(student_id=current_user_id).all()
    result = []
    for a in applications:
        posting = Posting.query.get(a.posting_id)
        result.append({
            "application_id": a.id,
            "posting_id": a.posting_id,
            "posting_title": posting.title if posting else "Unknown",
            "company_name": posting.company_name if posting else "Unknown",
            "status": a.status
        })
    return jsonify(result)

@app.route('/my-postings', methods=['GET']) 
@jwt_required() 
def my_postings(): 
    current_user_id = get_jwt_identity() 
    postings = Posting.query.filter_by(posted_by=current_user_id).all() 
    result = [] 
    for p in postings: 
        result.append({ 
            "id": p.id, 
            "title": p.title, 
            "company_name": p.company_name, 
            "status": p.status 
        }) 
    return jsonify(result)

@app.route('/postings/<int:posting_id>/applicants', methods=['GET']) 
@jwt_required() 
def get_applicants(posting_id): 
    current_user_id = get_jwt_identity() 
    posting = Posting.query.get_or_404(posting_id) 
    if str(posting.posted_by) != current_user_id: 
        return jsonify({"error": "Not authorized to view applicants for this posting"}), 403 
    
    applications = Application.query.filter_by(posting_id=posting_id).all() 
    result = [] 
    for a in applications: 
        student = User.query.get(a.student_id) 
        result.append({ 
            "application_id": a.id, 
            "student_name": student.name if student else "Unknown", 
            "student_email": student.email if student else "Unknown", 
            "status": a.status 
        }) 
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)