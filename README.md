# What problem we are trying to solve

We are trying to link bank accounts of the user so all the information from different accounts can be viewed in one place

# UI Details

There are three views

- user
  - only view one account details
- pro
  - view as many account details
- admin
  - change the data in the database by setting roles

# Libraries used

- autopep8
- Flask
- mysqlclient
- plaid

# Other resources

- React
- planetscale database

# Separation of work

- Chris Que and isaiah Alex
  - Frontend
- Miguel
  - connected api to database
  - connected api to frontend
  - worked on most of the functionality
  - setup database

# How to run the project

## 1. Install dependencies in the client and the server

```bash

cd client

npm install

cd ../

cd server

pip install -r requirements.txt

```

## 2. Run the client and the server

```bash

cd client

npm run dev

cd ../

cd server

python / python3 app.py

```

## 3. Open the browser and go to http://localhost:3000
