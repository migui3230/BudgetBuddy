from flask import Flask, jsonify

app = Flask(__name__)


# TODO: interact with planetscale DB
# TODO: do role based access control for the model
# TODO: change access to APIs based on the role
# TODO: once the user logs in via clerk, fetch the data for that user


@ app.route('/')
def index():
    data = {
        'name': 'John Doe',
    }
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
