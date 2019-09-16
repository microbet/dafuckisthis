Website that helps homeowners and solar professionals of various types work together to provide the best quality solar installations with the minimum hassle and duplication of work so that the homeowner gets a great deal and all the professionals receive fair compensation and can work together more cooperatively.

will add more to this later, just reminders on how and where this is being developed.

The flask server is going to run on linode.  The IP address will be 173.255.247.69.  To start the flask server SSH in and "source activate" from in the /dafuck-api/flask-env/bin directory to start the virtual environment.  Then python3 dafuck-api.py in the dafuck-api directory.

The react can run locally in helpyourselfsolar/frontend.  npm start to start that, but it also running on the linode server.

the database is on linode mariadb/mysql.  You have to be root to log in.  All pwords are u....w/suffix

All of this is running on its own on the linode server.  It should also be able to run here on the laptop.
in the frontend still do the npm start
start the mysql server with mysqld command
in the backend folder go into the helpyourselfsolarenv and Scripts and just 'activate' and then back and 'python helpyourselfsolar-api.py' and then in works more or less

I'm going to use Auth0 I think and already have an account there under jay.new...https://auth0.com/blog/react-tutorial-building-and-securing-your-first-app/ has instructions I'm following

should also look at this (maybe first) for securing the api
https://auth0.com/docs/quickstart/backend/python/01-authorization

auth0, dafuck-api, https://173.255.247.69/dafuck-api
public key in JSON Web Key Set format
RS256 algorithm

Not sure about some of the above.  The dev and production environments are completely separate with dev on the laptop.

DEV
npm start from the frontend directory

to start the backend go into backend/helpyourselfsolarenv/Scripts and do "source activate"
and then back to backend and "python helpyourselfsolar-api.py" to start the serverw

the database is mariadb/mysql.  You have to be root to log in.  All pwords are u....w/suffix

I set up email to be used with python at jay.devsoft@gmail.com with pword b...w/suffix
this is setup to allow less secure programs to use it.  It could be made more secure with 0Auth2 or something
look at this: https://developers.google.com/gmail/api/quickstart/python
use SMTP_SSL connect to port 465..check out: https://realpython.com/python-send-email/

