import MySQLdb
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

db = MySQLdb.connect(
    host=os.getenv("HOST"),
    user=os.getenv("USERNAME"),
    passwd=os.getenv("PASSWORD"),
    db=os.getenv("DATABASE"),
    ssl_mode="VERIFY_IDENTITY",
    ssl={
        "ca": "/etc/ssl/cert.pem"
    }
)


# TODO: do role based access control for the model
# TODO: change access to APIs based on the role
# TODO: once the user logs in via clerk, fetch the data for that user

# TODO: create a table for users that have username, email, role


""" 
the value proposition of the app is that you can see all your accounts in one place

"""


@ app.route('/')
def index():
    cursor = db.cursor()
    data = [
        ('john.doe@example.com', 'johndoe'),
        ('jane.smith@example.com', 'janesmith'),
        ('jimmy.kim@example.com', 'jimmykim')
    ]
    for d in data:
        cursor.execute(
            "INSERT INTO users (email, username) VALUES (%s, %s)", d)

    db.commit()
    cursor.close()
    db.close()
    return 'data added!'


@app.route('/api/addUser', methods=['POST'])
def addUser():
    data = request.get_json()
    email = data['email']
    role = data['role']

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO users (email, role) VALUES (%s, %s)", (email, role))
    db.commit()
    cursor.close()
    db.close()

    response = {
        "status": "success",
        "message": "User added successfully"
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
