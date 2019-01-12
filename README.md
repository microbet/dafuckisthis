Web and phone app for people to post images, other people to guess what it is, and people can rank answers.  Might be able to be used as some kind of social media.

will add more to this later, just reminders on how and where this is being developed.

The flask server is running on linode.  The IP address is 173.255.247.69.  To start the flask server SSH in and "source activate" from in the /dafuck-api/flask-env/bin directory to start the virtual environment.  Then python3 dafuck-api.py in the dafuck-api directory.

The react is running locally in dafuckisthis/frontend.  npm start to start that.

the database is on linode mariadb/mysql.  You have to be root to log in.  All pwords are u....w/suffix

I'm going to use Auth0 I think and already have an account there under jay.new...https://auth0.com/blog/react-tutorial-building-and-securing-your-first-app/ has instructions I'm following

should also look at this (maybe first) for securing the api
https://auth0.com/docs/quickstart/backend/python/01-authorization

auth0, dafuck-api, https://173.255.247.69/dafuck-api
public key in JSON Web Key Set format
RS256 algorithm

don't have python-dotenv, python-jose-cryptodome, flask-cors
do have flask and six
python-jose-cryptodome only has 5 stars - ok anyway
