import MySQLdb
import os
from flask import Flask, jsonify
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

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
CREATE TABLE IF NOT EXISTS users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'pro') NOT NULL DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  UNIQUE KEY username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


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


if __name__ == '__main__':
    app.run(debug=True)
