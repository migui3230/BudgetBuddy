import MySQLdb
import os
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from dotenv import load_dotenv
import plaid
load_dotenv()

app = Flask(__name__)
CORS(app)


def get_db_connection():
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
    return db


@app.route('/api/addUser', methods=['POST'])
def addUser():
    data = request.get_json()
    email = data['email']
    role = data['role']
    db = get_db_connection()

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


@app.route('/api/getUserByEmail', methods=['GET'])
def getUserByEmail():
    email = request.args.get('email')
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    row = cursor.fetchone()
    cursor.close()
    db.close()

    if row:
        user = {
            "id": row[0],
            "email": row[1],
            "role": row[2]
        }
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404


@app.route('/api/getAllUsers', methods=['GET'])
def getAllUsers():
    db = get_db_connection()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    cursor.close()
    db.close()

    users = []
    for row in rows:
        user = {
            "id": row[0],
            "email": row[1],
            "role": row[2]
        }
        users.append(user)
    return jsonify(users)


@app.route('/api/updateUsers', methods=['POST'])
def updateUsers():
    data = request.get_json()
    db = get_db_connection()
    cursor = db.cursor()
    for d in data:
        cursor.execute(
            "UPDATE users SET role = %s WHERE email = %s", (d['role'], d['email']))
    db.commit()
    cursor.close()
    db.close()

    response = {
        "status": "success",
        "message": "Users updated successfully"
    }
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
