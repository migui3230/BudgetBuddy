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


# PLAID_CLIENT_ID = os.environ.get('PLAID_CLIENT_ID')
# PLAID_SECRET = os.environ.get('PLAID_SANDBOX_SECRET')
# PLAID_ENV = os.environ.get('PLAID_ENV', 'sandbox')

# client = plaid.ApiClient(client_id=PLAID_CLIENT_ID,
#                          secret=PLAID_SECRET, environment=PLAID_ENV)


# @app.route('/api/create_link_token', methods=['POST'])
# def create_link_token():
#     try:
#         response = client.LinkToken.create({
#             'client_name': 'Plaid Quickstart',
#             'country_codes': ['US'],
#             'language': 'en',
#             'user': {
#                 'client_user_id': '0',
#             },
#             'redirect_uri': 'http://localhost:3000/plaid/',
#             'products': ['transactions'],
#         })

#         return jsonify(response), 200
#     except plaid.errors.PlaidError as error:
#         return jsonify({'error': str(error)}), 400


# @app.route('/api/auth', methods=['POST'])
# def auth():
#     try:
#         access_token = request.json['access_token']
#         plaid_response = client.Auth.get(access_token)

#         return jsonify(plaid_response), 200
#     except plaid.errors.PlaidError as error:
#         return jsonify({'error': str(error)}), 400


# @app.route('/api/exchange_public_token', methods=['POST'])
# def exchange_public_token():
#     try:
#         public_token = request.json['public_token']
#         plaid_response = client.Item.public_token.exchange(public_token)

#         access_token = plaid_response['access_token']
#         return jsonify({'accessToken': access_token}), 200
#     except plaid.errors.PlaidError as error:
#         return jsonify({'error': str(error)}), 400


# @app.route('/api/transactions', methods=['POST'])
# def transactions():
#     try:
#         access_token = request.json['access_token']
#         plaid_response = client.Transactions.get(
#             access_token, start_date="2019-01-01", end_date="2020-01-31")

#         return jsonify(plaid_response), 200
#     except plaid.errors.PlaidError as error:
#         return jsonify({'error': str(error)}), 400


if __name__ == '__main__':
    app.run(debug=True)
