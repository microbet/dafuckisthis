#! /usr/bin/python

from flask import Flask, jsonify, Response, json, flash, request, redirect, url_for, render_template, session, make_response
from flask_cors import CORS
import mysql.connector as mariadb
import os
from random import *
import string
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from PIL import Image
import sys

app = Flask(__name__)
CORS(app)

#conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', database='dafuckapi')
#cursor = conn.cursor()
UPLOAD_FOLDER = './static/images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
SECRET_KEY = 'beetlebob'
app.config['SECRET_KEY'] = SECRET_KEY
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER 

#@app.route('/')
#@app.route('/index')
#def index():
#    return render_template('welcome.html')

#####
# route to submit an image and a caption
#####

def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload_image', methods=['POST'])
def upload_image():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    # check to see if the post request has the file part
    if 'file' not in request.files:
        flash('No file part')
        return jsonify({'message' : 'No file included'})
    file = request.files['file']
    try:
        caption = request.form['caption']
    except NameError:
        pass
    else:
        caption = ''
    if file.filename == '':
        flash('No file selected')
        return jsonify({'message' : 'No file selected'})
    
    print(file)
    print(file.filename)
    print(allowed_file(file.filename))
    if file and allowed_file(file.filename):
        print("why")
        # shouldn't always have user_id=1
        if valid_user(request.form['user_id'], request.form['sessionvalue']):
            print("hi ")
            user_id = request.form['user_id']
        else:
            print("hi di")
            user_id=0
        print("hi di do")
        cursor.execute("INSERT INTO imagemetadata VALUES ('', '', %s, %s, 0)", 
                       (caption, user_id))
        conn.commit()
        image_id = cursor.lastrowid
        filename = str(image_id) + '_' + secure_filename(file.filename)
        cursor.execute("UPDATE imagemetadata SET filename=%s WHERE \
                image_id=%s", (filename, image_id)) 
        print("hi ", filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        #this might be able to be done to stream
        image = Image.open(os.path.join(app.config['UPLOAD_FOLDER'], 
            filename))
        image.thumbnail((400, 400))
        image.save(os.path.join(app.config['UPLOAD_FOLDER'],
            filename))
        conn.commit()
        conn.close()
        imagePath = "/static/images/" + file.filename
        return jsonify({'imagePath' : imagePath, 'image_id' : cursor.lastrowid})
    else:
        return jsonify({'message' : 'No file or filetype not allowed'})

###
# login
###

@app.route('/login', methods=['POST'])
def login():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    response = jsonify()
    cursor.execute("SELECT password_hash, user_id FROM user WHERE username=%s", 
            (request.form['username'],))
    data = cursor.fetchone()
    if data is not None:
        if check_password_hash(data[0], request.form['password']):
            sessionvalue = ''.join([choice(string.ascii_letters +
                string.digits) for n in range(32)])
            response =  jsonify({'username' : request.form['username'], 
                'userId' : data[1], 'sessioncode' : sessionvalue })
            cursor.execute("UPDATE user SET sessionvalue=%s WHERE user_id=%s",
                    (sessionvalue, data[1]))
            conn.commit()
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
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    first_hash = generate_password_hash(request.form['password'])
    cursor.execute("INSERT INTO user (user_id, username, password_hash) \
            VALUES ('', %s, %s)", (request.form['username'], first_hash))
    conn.commit()
    conn.close()

    return jsonify({'userId' : cursor.lastrowid})

#####
# route to add a caption
#####

@app.route('/caption', methods=['GET', 'POST'])
def caption():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    ret_obj = {'message' : request.form['caption'], 
            'image_id' : request.form['imageId']}
    cursor.execute("UPDATE imagemetadata SET caption=%s WHERE image_id=%s", 
            (request.form['caption'], request.form['imageId']))
    conn.commit()
    conn.close()
    return jsonify({'message' : ret_obj})

#####
# route to add an answer
#####

@app.route('/answer', methods=['POST'])
def answer():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    if (request.form['answer'] == ''): 
        data = {'error' : 'No answer was received'}
        return jsonify(data)
    if valid_user(request.form['user_id'], request.form['sessionvalue']):
        sql = ("INSERT INTO answer VALUES ('', %s, %s, %s, 0, 0)")
        cursor.execute(sql, (request.form['imageId'], request.form['answer'], 
            request.form['user_id']))
    else:
        sql = ("INSERT INTO answer VALUES (NULL, %s, %s, 0, 0, 0)")
        print("sql is ", sql)
        print("imageId is ", request.form['imageId'])
        print("answer is ", request.form['answer'])
        cursor.execute(sql, (request.form['imageId'], request.form['answer'])) 
    sql = "UPDATE imagemetadata SET answer_count=answer_count+1 WHERE \
           image_id=%s"
    print("sql second time is ", sql)
    cursor.execute(sql, (request.form['imageId'],))
    conn.commit()
    conn.close()
    data = {'answer_id' : cursor.lastrowid}
    return jsonify(data)

#####
# route to get an image given an image_id
# probably will also return a caption
# if there is no image_id, just return the 
# most recent image
#####

# if selected_image is 'user' get just the users
@app.route('/get_image', methods=['GET'])
def get_image():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    response = jsonify()
    response.headers.add('Access-Control-Allow-Headers',
            "Origin, X-Requested-With, Content-Type, Accept, x-auth")
    data = {}
    query = "SELECT caption, filename, image_id FROM imagemetadata \
            ORDER BY image_id DESC LIMIT 1"
    cursor.execute(query)
    row = cursor.fetchone()
    last_caption = row[0]
    last_imagePath = row[1]
    last_id = row[2]
    query = "SELECT caption, filename, image_id FROM imagemetadata \
            ORDER BY image_id LIMIT 1"
    cursor.execute(query)
    row = cursor.fetchone()
    first_caption = row[0]
    first_imagePath = row[1]
    first_id = row[2]
    if request.args['selected_image'] == 'latest':
        data['caption'] = last_caption
        data['imagePath'] = '/static/images/' + last_imagePath
        data['image_id'] = last_id
        data['imagePosition'] = 'last'
        conn.close()
        return jsonify(data)
    elif request.args['selected_image'] == 'previous':
        query = "SELECT caption, filename, image_id FROM imagemetadata \
                WHERE image_id < %s ORDER BY image_id DESC LIMIT 1"
        cursor.execute(query, (request.args['imageId'],))
    elif request.args['selected_image'] == 'user_previous':
        if valid_user(request.args['user_id'], request.args['sessionvalue']):
            query = "SELECT caption, filename, image_id FROM imagemetadata \
                    WHERE image_id < %s AND user_id = %s ORDER BY image_id \
                    DESC LIMIT 1"
            cursor.execute(query, (request.args['imageId'], request.args['user_id']))
        else:
            data['error'] = 'No results'
            conn.close()
            return jsonify(data)
    elif request.args['selected_image'] == 'next':
        query = "SELECT caption, filename, image_id FROM imagemetadata \
                WHERE image_id > %s LIMIT 1"
        cursor.execute(query, (request.args['imageId'],))
    elif request.args['selected_image'] == 'user_next':
        if valid_user(request.args['user_id'], request.args['sessionvalue']):
            query = "SELECT caption, filename, image_id FROM imagemetadata \
                    WHERE image_id > %s AND user_id = %s ORDER BY image_id \
                    LIMIT 1"
            cursor.execute(query, (request.args['imageId'], request.args['user_id']))
        else:
            data['error'] = 'No results'
            conn.close()
            return jsonify(data)
    elif request.args['selected_image'] == 'most_answers':
        query = "SELECT caption, filename, image_id FROM imagemetadata \
                ORDER BY answer_count DESC LIMIT 1"
        cursor.execute(query)
    elif request.args['selected_image'] == 'user':
        if valid_user(request.args['user_id'], request.args['sessionvalue']):
            query = "SELECT caption, filename, image_id FROM imagemetadata \
                    WHERE user_id = %s ORDER BY image_id DESC LIMIT 1"
            cursor.execute(query, (request.args['user_id'],))
        else:
            data['error'] = 'No results'
            conn.close()
            return jsonify(data)
    else: 
        query = "SELECT caption, filename, image_id FROM imagemetadata \
                WHERE image_id=%s"
        cursor.execute(query, (request.args['imageId'],))
    row = cursor.fetchone()
    if cursor.rowcount < 0:
        data['error'] = 'No results'
        conn.close()
        return jsonify(data)
    data['caption'] = row[0] 
    data['imagePath'] = '/static/images/' + row[1]
    data['image_id'] = row[2] 
    if row[2] == first_id:
        data['imagePosition'] = 'first'
    elif row[2] == last_id:
        data['imagePosition'] = 'last'
    else:
        data['imagePosition'] = 'middle'
    conn.close()
    return jsonify(data) 

@app.route('/get_most_net_upvoted', methods=['GET'])
def get_most_net_upvoted():
    data = []
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4',
            database='dafuckapi')
    cursor = conn.cursor()
    sql = "SELECT answer, answer_id, up, down FROM answer WHERE image_id=%s \
            ORDER BY up-down DESC LIMIT 10"
    cursor.execute(sql, (request.args['imageId'],))
    for row in cursor.fetchall():
        data.append({ 'answer' : row[0], 'answerId' : row[1],
            'up' : row[2], 'down' : row[3] })
    conn.close()
    response = jsonify(data)
    return response

@app.route('/get_most_net_downvoted', methods=['GET'])
def get_most_net_downvoted():
    data = []
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4',
            database='dafuckapi')
    cursor = conn.cursor()
    sql = "SELECT answer, answer_id, up, down FROM answer WHERE image_id=%s \
            ORDER BY down-up DESC LIMIT 10"
    cursor.execute(sql, (request.args['imageId'],))
    for row in cursor.fetchall():
        data.append({ 'answer' : row[0], 'answerId' : row[1],
            'up' : row[2], 'down' : row[3] })
    conn.close()
    response = jsonify(data)
    return response

@app.route('/get_most_downvoted', methods=['GET'])
def get_most_downvoted():
    data = []
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4',
            database='dafuckapi')
    cursor = conn.cursor()
    sql = "SELECT answer, answer_id, up, down FROM answer WHERE image_id=%s \
            ORDER BY down DESC LIMIT 10"
    cursor.execute(sql, (request.args['imageId'],))
    for row in cursor.fetchall():
        data.append({ 'answer' : row[0], 'answerId' : row[1],
            'up' : row[2], 'down' : row[3] })
    conn.close()
    response = jsonify(data)
    return response

@app.route('/get_most_upvoted', methods=['GET'])
def get_most_upvoted():
    data = []
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4',
            database='dafuckapi')
    cursor = conn.cursor()
    sql = "SELECT answer, answer_id, up, down FROM answer WHERE image_id=%s \
            ORDER BY up DESC LIMIT 10"
    cursor.execute(sql, (request.args['imageId'],))
    for row in cursor.fetchall():
        data.append({ 'answer' : row[0], 'answerId' : row[1],
            'up' : row[2], 'down' : row[3] })
    conn.close()
    response = jsonify(data)
    return response

@app.route('/get_most_voted', methods=['GET'])
def get_most_voted():
    data = []
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4',
            database='dafuckapi')
    cursor = conn.cursor()
    sql = "SELECT answer, answer_id, up, down FROM answer WHERE image_id=%s \
            ORDER BY up+down DESC LIMIT 10"
    cursor.execute(sql, (request.args['imageId'],))
    for row in cursor.fetchall():
        data.append({ 'answer' : row[0], 'answerId' : row[1],
            'up' : row[2], 'down' : row[3] })
    conn.close()
    response = jsonify(data)
    return response

@app.route('/get_answers', methods=['GET'])
def get_answers():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    data = [] 
    response = jsonify()
    response.headers.add('Access-Control-Allow-Headers',
            "Origin, X-Requested-With, Content-Type, Accept, x-auth")
    sql = ('SELECT answer, answer_id, up, down FROM answer WHERE image_id=%s \
            ORDER BY answer_id DESC LIMIT 10')
    if request.args['answerId'] is '0':
        cursor.execute(sql, (request.args['imageId'],))
    else:
        sql = ('SELECT count(*) AS count FROM answer WHERE answer_id<%s AND \
                image_id=%s ORDER BY answer_id DESC LIMIT 10')
        cursor.execute(sql, (request.args['answerId'], 
            request.args['imageId']))
        if (cursor.fetchone())[0] < 10:
            sql = ('SELECT answer, answer_id, up, down FROM answer WHERE \
                    image_id=%s ORDER BY answer_id ASC LIMIT 10')
            cursor.execute(sql, (request.args['imageId'],))
        else:
            sql = ('SELECT answer, answer_id, up, down FROM answer WHERE \
                    answer_id<%s AND image_id=%s ORDER BY answer_id DESC LIMIT 10')
            cursor.execute(sql, (request.args['answerId'], 
                request.args['imageId']))

    for row in cursor.fetchall():
        data.append({ 'answer' : row[0], 'answerId' : row[1],
            'up' : row[2], 'down' : row[3] })
    conn.close()
    response = jsonify(data)
    return response

@app.route('/get_answer', methods=['GET'])
def get_answer():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    data = [] 
    js = json.dumps(data)
    resp = Response(js, status=200, mimetype='application/json')
    if request.args['answerId'] is '0':
        conn.close()
        return
    if request.args['direction'] == 'next':
        sql = ('SELECT answer, answer_id, up, down FROM answer WHERE \
                answer_id<%s AND image_id=%s ORDER BY answer_id DESC \
                LIMIT 1')
    if request.args['direction'] == 'previous':
        sql = ('SELECT answer, answer_id, up, down FROM answer WHERE \
                answer_id>%s AND image_id=%s ORDER BY answer_id ASC \
                LIMIT 1')
    cursor.execute(sql, (request.args['answerId'], request.args['imageId']))
    row = cursor.fetchone()
    if cursor.rowcount > 0:
       data.append({ 'answer' : row[0], 'answerId' : row[1], 
                     'up' : row[2], 'down' : row[3]})
    else:
       res = { 'response' : 'done' }
       print("res is ", res)
       return jsonify(res)
    print("data is ", data)
    conn.close()
    return jsonify(data)


@app.route('/get_previous_answer', methods=['GET'])
def get_previous_answer():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    data = [] 
    js = json.dumps(data)
    resp = Response(js, status=200, mimetype='application/json')
    if request.args['answerId'] is '0':
        return
    else:
        sql = ('SELECT answer, answer_id, up, down FROM answer WHERE answer_id>%s \
                AND image_id=%s ORDER BY answer_id ASC LIMIT 1')
        cursor.execute(sql, (request.args['answerId'], request.args['imageId']))
        row = cursor.fetchone()
        if cursor.rowcount > 0:
            data.append({ 'answer' : row[0], 'answerId' : row[1], 
                'up' : row[2], 'down' : row[3] })
        else:
            res = { 'response' : 'newest' }
            return jsonify(res)

    conn.close()
    return jsonify(data)

#need to make sure you can't vote more than once
#get user_id from session
#need a new table of all the answers a user has voted on
@app.route('/vote', methods=['POST'])
def vote():
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
    cursor = conn.cursor()
    data = {}
    if valid_user(request.form['user_id'], request.form['sessionvalue']):
        sql = ("SELECT user_answer_id, vote FROM user_answer WHERE user_id=%s and \
                answer_id=%s")
        cursor.execute(sql, (request.form['user_id'], request.form['answer_id']))
        row = cursor.fetchone()
        if cursor.rowcount > 0:
            sql = ("UPDATE user_answer SET vote=%s WHERE user_answer_id=%s")
            cursor.execute(sql, (request.form['vote'], row[0]))
            conn.commit()
            if (request.form['vote'] == 'up' and row[1] == 'down'):
                sql = ("UPDATE answer SET up=up+1, down=down-1 WHERE answer_id=%s")
                cursor.execute(sql, (request.form['answer_id'],))
                conn.commit()
            if (request.form['vote'] == 'down' and row[1] == 'up'):
                sql = ("UPDATE answer SET up=up-1, down=down+1 WHERE answer_id=%s")
                cursor.execute(sql, (request.form['answer_id'],))
                conn.commit()
        else:
            sql = ("INSERT INTO user_answer VALUES ('', %s, %s, %s)")
            cursor.execute(sql, (request.form['user_id'], request.form['answer_id'],
                request.form['vote']))
            conn.commit()
            if (request.form['vote'] == 'up'):
                sql = ("UPDATE answer SET up=up+1 WHERE answer_id=%s")
                cursor.execute(sql, (request.form['answer_id'],))
                conn.commit()
            if (request.form['vote'] == 'down'):
                sql = ("UPDATE answer SET down=down+1 WHERE answer_id=%s")
                cursor.execute(sql, (request.form['answer_id'],))
                conn.commit()
        sql = ("SELECT up, down FROM answer WHERE answer_id=%s")
        cursor.execute(sql, (request.form['answer_id'],))
        row = cursor.fetchone()
        conn.close()
        data = {"answer_id" : request.form['answer_id'], "up" : row[0], "down" : row[1]}
        response = jsonify(data)
    else:
        response = jsonify()
        response = jsonify({"message" : "Not a valid user"})

    return response

def valid_user(user_id, sessionvalue):
    conn = mariadb.connect(user='dafuckapi', password='bgesaw#4', 
            database='dafuckapi')
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




#####
# route to add a response to an image
# if sent with a response_id it will edit
# that response
#####



