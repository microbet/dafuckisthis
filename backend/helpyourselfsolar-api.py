#! /usr/bin/python

from flask import Flask, jsonify, Response, json, flash, request, redirect, url_for, render_template, session, make_response
from flask_cors import CORS
import mysql.connector as mariadb
import os
from random import *
import string
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import sys
import smtplib
import ssl
from email.message import EmailMessage

app = Flask(__name__)
CORS(app)
port = 465 #for SSL

SECRET_KEY = 'beetlebob'
app.config['SECRET_KEY'] = SECRET_KEY

###
# login
###

@app.route('/login', methods=['POST'])
def login():
    conn = mariadb.connect(user='helpyourselfsolar', password='bgesaw#4', 
            database='helpyourselfsolar')
    cursor = conn.cursor()
    response = jsonify()
    cursor.execute("SELECT password_hash, user_id FROM user WHERE username=%s", 
            (request.form['username'],))
    data = cursor.fetchone()
    if data is not None:
        if check_password_hash(data[0], request.form['password']):
            sessionvalue = ''.join([choice(string.ascii_letters +
                string.digits) for n in range(32)])
            cursor.execute("UPDATE user SET sessionvalue=%s WHERE user_id=%s",
                    (sessionvalue, data[1]))
            conn.commit()
            # probably need a new function for getting user info
            cursor.execute("SELECT property_id, street_address, city, state, zip FROM \
                    property WHERE user_id=%s LIMIT 1", (data[1],))
            row = cursor.fetchone()
            rowcount = cursor.rowcount
            if rowcount > 0:
                property_id = row[0]
                street_address = row[1]
                city = row[2]
                thestate = row[3]
                zip = row[4]
            else:
                property_id = 0
                street_address = ""
                city = ""
                thestate = ""
                zip = ""
            # need to get their phone and email
            cursor.execute("SELECT phone FROM phone WHERE user_id=%s LIMIT 1", (data[1],))
            row = cursor.fetchone()
            rowcount = cursor.rowcount
            if rowcount > 0:
                phone = row[0]
            else:
                phone = ""
            cursor.execute("SELECT email FROM email WHERE user_id=%s LIMIT 1", (data[1],))
            row = cursor.fetchone()
            rowcount = cursor.rowcount
            if rowcount > 0:
                email = row[0]
            else:
                email = ""
            # find out if they have a SVDate (site visit date)
            cursor.execute("SELECT created FROM event WHERE type='site visit appointment request' \
                    AND user_id=%s ORDER BY event_id DESC LIMIT 1", (data[1],))
            row = cursor.fetchone()
            rowcount = cursor.rowcount
            if rowcount > 0:
                SVDate = row[0]
            else:
                SVDate = ""
            # find out energy usage
            janKWH = febKWH = marKWH = aprKWH = mayKWH = junKWH = julKWH = augKWH = sepKWH = ''
            octKWH = novKWH = decKWH = ''
            print("property_id is ", property_id);
            print("hi")
            cursor.execute("SELECT month, kwh FROM energy_month WHERE property_id=%s", (property_id,))
            print("hi there")
            for row in cursor.fetchall():
                if row[0] == 'jan':
                    janKWH = row[1]
                if row[0] == 'feb':
                    febKWH = row[1]
                if row[0] == 'mar':
                    marKWH = row[1]
                if row[0] == 'apr':
                    aprKWH = row[1]
                if row[0] == 'may':
                    mayKWH = row[1]
                if row[0] == 'jun':
                    junKWH = row[1]
                if row[0] == 'jul':
                    julKWH = row[1]
                if row[0] == 'aug':
                    augKWH = row[1]
                if row[0] == 'sep':
                    sepKWH = row[1]
                if row[0] == 'oct':
                    octKWH = row[1]
                if row[0] == 'nov':
                    novKWH = row[1]
                if row[0] == 'dec':
                    decKWH = row[1]
            response =  jsonify({'username' : request.form['username'], 
                'userId' : data[1], 'sessioncode' : sessionvalue, 'property_id' : property_id,
                'street_address' : street_address, 'city' : city, 'thestate' : thestate, 'zip' : zip,
                'phone' : phone, 'email' : email, 'SVDate' : SVDate, 'janKWH' : janKWH, 'febKWH' : febKWH,
                'marKWH' : marKWH, 'aprKWH' : aprKWH, 'mayKWH' : mayKWH, 'junKWH' : junKWH, 'julKWH' : julKWH, 
                'augKWH' : augKWH, 'sepKWH' : sepKWH, 'octKWH' : octKWH, 'novKWH' : novKWH, 'decKWH' : decKWH })
        else:
            response = jsonify({'userId' : 0 })
    else:
        response = jsonify({'userId' : 0 })
    conn.close()
    return response
    #return res

###
# register
###

@app.route('/register', methods=['POST'])
def register():
    try:
        conn = mariadb.connect(user='helpyourselfsolar', password='bgesaw#4', 
            database='helpyourselfsolar')
        cursor = conn.cursor()
        first_hash = generate_password_hash(request.form['password'])
        cursor.execute("INSERT INTO user (user_id, username, password_hash) \
                VALUES (null, %s, %s)", (request.form['username'], first_hash))
        conn.commit()
        userId = cursor.lastrowid
        sessionvalue = ''.join([choice(string.ascii_letters +
            string.digits) for n in range(32)])
        cursor.execute("UPDATE user SET sessionvalue=%s WHERE user_id=%s",
            (sessionvalue, userId))
        conn.close()
        return jsonify({'userId' : userId, 'username' : request.form['username'],
            'sessioncode' : sessionvalue })
    except mariadb.Error as err:
        print("Something went wrong: {}".format(err.errno))
        if err.errno == 1062:
            return jsonify({'userId' : 'Duplicate username'})
        else:
            return jsonify({'userId' : 'Database error'})

# need to make combo of phone/email and type unique I think
@app.route('/basic_info', methods=['POST'])
def basic_info():
    print("city is " + request.form['city'], file=sys.stderr)
    print("thestate is " + request.form['thestate'], file=sys.stderr)
    conn = mariadb.connect(user='helpyourselfsolar', password='bgesaw#4', 
            database='helpyourselfsolar')
    cursor = conn.cursor()
    # change this from editing tag to search for main and update if editing
    # maybe
    print("rfe = ", request.form['editing'])
    if request.form['editing'] == '1':
        #property_id = request.form['property_id']
        #property_id = 
        print(request.form['streetAddress'])
        print(request.form['city'])
        print(request.form['thestate'])
        print(request.form['zip'])
        print(request.form['phone'])
        print(request.form['email'])
        print(request.form['property_id'])
        cursor.execute("UPDATE property SET street_address=%s, \
                city=%s, state=%s, zip=%s WHERE property_id=%s", \
                (request.form['streetAddress'], request.form['city'], \
                request.form['thestate'], request.form['zip'], request.form['property_id']))
        # could check if phone exists, but it should be required
        cursor.execute("UPDATE phone SET phone=%s WHERE user_id=%s AND type='main'", \
                (request.form['phone'], request.form['user_id']))
        cursor.execute("UPDATE email SET email=%s WHERE user_id=%s AND type='main'", \
                (request.form['email'], request.form['user_id']))
        property_id = request.form['property_id']
    else:
        print("why am I here", request.form['editing'])
        print("street_address is ", request.form['streetAddress']);
        print("zip is ", request.form['zip']);
        print("uid = ", request.form['user_id']);
        cursor.execute("INSERT INTO property (property_id, street_address, \
                city, state, zip, user_id) VALUES (null, %s, %s, %s, %s, %s)", \
                (request.form['streetAddress'], request.form['city'], \
                request.form['thestate'], request.form['zip'], request.form['user_id']))
        property_id = cursor.lastrowid
        cursor.execute("INSERT INTO phone (phone_id, phone, type, user_id) VALUES (null, \
            %s, %s, %s)", (request.form['phone'], 'main', request.form['user_id']))
        cursor.execute("INSERT INTO email (email_id, email, type, user_id) VALUES (null, \
            %s, %s, %s)", (request.form['email'], 'main', request.form['user_id']))
    conn.commit()
    conn.close()
    return jsonify({'property_id' : property_id })

@app.route('/appointment', methods=['POST'])
def appointment():
    print("user_id is " + request.form['user_id'], file=sys.stderr)
    print("note is " + request.form['note'], file=sys.stderr)
    print("type is " + request.form['type'], file=sys.stderr)
    print("property_id is " + request.form['property_id'], file=sys.stderr)
    conn = mariadb.connect(user='helpyourselfsolar', password='bgesaw#4', 
            database='helpyourselfsolar')
    cursor = conn.cursor()
    contact_info = get_contact_info(request.form['user_id'], cursor)
    cursor.execute("INSERT INTO event (event_id, note, type, created, user_id, property_id) \
        VALUES (null, %s, %s, now(), %s, %s)", (request.form['note'], request.form['type'], \
        request.form['user_id'], request.form['property_id']))
    conn.commit()
    conn.close()
    print("send and email to ", contact_info)
    content = "Subject: Site Visit request from helpyourselfsolar\n" + "user_id is " + \
            request.form['user_id'] + '\n\n' + request.form['note'] + '\n' + \
            "property_id is " + request.form['property_id'] + '\n' + \
            "contact info is " + json.dumps(contact_info)
    # Create a secure SSL context
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login("jay.devsoft@gmail.com", "bgesaw#4")
        server.sendmail("jay.devsoft@gmail.com", "jay.newenergy@gmail.com", content)
    return jsonify({'returnvar' : 1 })

def get_contact_info(user_id, cursor):
    print("in gci uid is ", user_id)
    cursor.execute("SELECT email FROM email WHERE user_id=%s AND type='main' ORDER BY email_id \
            DESC LIMIT 1", (user_id,))
    row = cursor.fetchone()
    email = row[0]
    cursor.execute("SELECT phone FROM phone WHERE user_id=%s AND type='main' ORDER BY phone_id \
            DESC LIMIT 1", (user_id,))
    row = cursor.fetchone()
    phone = row[0]
    cursor.execute("SELECT street_address, city, state, zip FROM property WHERE user_id=%s \
            ORDER BY property_id DESC LIMIT 1", (user_id,))
    row = cursor.fetchone()
    street_address = row[0]
    city = row[1]
    state = row[2]
    zip = row[3]
    contact_info = {
            'email' : email,
            'phone' : phone,
            'street_address' : street_address,
            'state' : state,
            'zip' : zip
            }
    return contact_info

@app.route('/energy', methods=['POST'])
def energy():
    print("property_id is " + request.form['property_id'], file=sys.stderr)
    print("jan is " + request.form['jan'], file=sys.stderr)
    print("feb is " + request.form['feb'], file=sys.stderr)
    print("mar is " + request.form['mar'], file=sys.stderr)
    print("apr is " + request.form['apr'], file=sys.stderr)
    print("may is " + request.form['may'], file=sys.stderr)
    print("jun is " + request.form['jun'], file=sys.stderr)
    print("jul is " + request.form['jul'], file=sys.stderr)
    print("aug is " + request.form['aug'], file=sys.stderr)
    print("sep is " + request.form['sep'], file=sys.stderr)
    print("oct is " + request.form['oct'], file=sys.stderr)
    print("nov is " + request.form['nov'], file=sys.stderr)
    print("dec is " + request.form['dec'], file=sys.stderr)
    conn = mariadb.connect(user='helpyourselfsolar', password='bgesaw#4', 
            database='helpyourselfsolar')
    cursor = conn.cursor()
    if request.form['editing'] == '1':
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['jan'], 'jan', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['feb'], 'feb', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['mar'], 'mar', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['apr'], 'apr', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['may'], 'may', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['jun'], 'jun', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['jul'], 'jul', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['aug'], 'aug', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['sep'], 'sep', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['oct'], 'oct', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['nov'], 'nov', request.form['property_id']))
        cursor.execute("UPDATE energy_month SET kwh=%s WHERE month=%s AND property_id=%s",
                (request.form['dec'], 'dec', request.form['property_id']))
    else:
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'jan', %s, %s)", (request.form['jan'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'feb', %s, %s)", (request.form['feb'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'mar', %s, %s)", (request.form['mar'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'apr', %s, %s)", (request.form['apr'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'may', %s, %s)", (request.form['may'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'jun', %s, %s)", (request.form['jun'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'jul', %s, %s)", (request.form['jul'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'aug', %s, %s)", (request.form['aug'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'sep', %s, %s)", (request.form['sep'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'oct', %s, %s)", (request.form['oct'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'nov', %s, %s)", (request.form['nov'], request.form['property_id'])) 
        cursor.execute("INSERT INTO energy_month (energy_month_id, month, kwh, property_id) \
            VALUES (null, 'dec', %s, %s)", (request.form['dec'], request.form['property_id'])) 
    conn.commit()
    conn.close()
    return jsonify({'returnvar' : 1 })

def valid_user(user_id, sessionvalue):
    conn = mariadb.connect(user='helpyourselfsolar', password='bgesaw#4', 
            database='helpyourselfsolar')
    cursor = conn.cursor()
    sql = ("SELECT user_id FROM user WHERE user_id=%s AND sessionvalue=%s")
    cursor.execute(sql, (user_id, sessionvalue))
    row = cursor.fetchone()
    conn.close()
    if cursor.rowcount >0:
        return True
    else:
        return False

if (__name__ == "__main__"):
    #app.run(host='0.0.0.0')
    app.run(host='127.0.0.1')
