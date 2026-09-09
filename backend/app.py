import os
from flask import Flask, jsonify, request
from models import db, Posting

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'portal.db')
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return jsonify({"message": "API is running"})

@app.route('/postings', methods=['POST'])
def create_posting():
    data = request.get_json()
    new_posting = Posting(
        title=data['title'],
        description=data['description'],
        requirements=data.get('requirements', ''),
        company_name=data['company_name'],
        posted_by=data['posted_by']
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
def update_posting(posting_id): 
    p = Posting.query.get_or_404(posting_id) 
    data = request.get_json() 
    p.title = data.get('title', p.title) 
    p.description = data.get('description', p.description) 
    p.requirements = data.get('requirements', p.requirements) 
    p.company_name = data.get('company_name', p.company_name) 
    p.status = data.get('status', p.status) 
    db.session.commit() 
    return jsonify({"message": "Posting updated"})

@app.route('/postings/<int:posting_id>', methods=['DELETE']) 
def delete_posting(posting_id): 
    p = Posting.query.get_or_404(posting_id) 
    db.session.delete(p) 
    db.session.commit() 
    return jsonify({"message": "Posting deleted"})


if __name__ == '__main__':
    app.run(debug=True)