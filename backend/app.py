from flask import Flask, jsonify
from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///portal.db'
db.init_app(app)

with app.app_context():
    db.create_all()


@app.route('/')
def home():
    return jsonify({"message": "API is running"})


if __name__ == '__main__':
    app.run(debug=True)