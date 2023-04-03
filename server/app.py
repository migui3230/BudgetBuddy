from flask import Flask, jsonify

app = Flask(__name__)


@ app.route('/')
def index():
    data = {
        'name': 'John Doe',
    }
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
