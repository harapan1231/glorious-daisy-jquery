# -*- coding: utf-8 -*- 

import sqlite3, json, logging, re
#from bottle import Bottle, view, request, response 
from bottle import * 

class ConstAttr(object):
    def __setattr__(self, name, value):
        if hasattr(self, name):
            raise AttributeError("Don't rebind %s" % name)
        object.__setattr__(self, name, value)

    def __delattr__(self, name):
        if hasattr(self, name):
            raise AttributeError("Don't unbind %s" % name)
        object.__delattr__(self, name)

CONST = ConstAttr()
CONST.DB = "glorious_daisy.sqlite3"

@error(404)
def error404(error):
    return "missing..:" + str(request)

@get("/www/<filepath:path>")
def static(filepath):
    return static_file(filepath, root="./www")

@get("/")
@view("index")
def index():
    return
#    songs = []
#    with open("./songs.txt", "r") as f:
#        for line in f:
#            songs.append(line)
#
#    return dict(songs=songs)

@post("/api/search_song")
def get_song():
    params = request.params.decode()
    song_text = params.get("song_text")
    name = params.get("name")
    description = params.get("description")
    created_at_from = params.get("created_at_from")
    created_at_to = params.get("created_at_to")

    sql = "SELECT song_id, song_text, description, name, date(created_at) FROM song WHERE 0 = 0 "
    
    if song_text:
        sql += " AND song_text LIKE '%" + song_text + "%'"
    if name:
        sql += " AND name LIKE '%" + name + "%'"
    if description:
        sql += " AND description LIKE '%" + description + "%'"
    if created_at_from:
        sql += " AND created_at >= datetime('" + created_at_from + " 00:00:00.000')"
    if created_at_to:
        sql += " AND created_at <= datetime('" + created_at_to + " 23:59:59.999')"

    sql += " ORDER BY RANDOM()"

    conn = sqlite3.connect(CONST.DB)
    c = conn.cursor()
    recs = c.execute(sql).fetchall()
    #TODO show limited records
    if 100 < len(recs):
        response.status = 901
        return
    cols = ("song_id", "song_text", "description", "name", "created_at")
    ret = []
    for row in recs:
        ret.append(dict(zip(cols, row)))
    return json.dumps(ret)

#TODO:merge search_song + get_song
@post("/api/get_song")
def get_song():
    params = request.params.decode()
    song_num = params.get("song_num")

    conn = sqlite3.connect(CONST.DB)
    c = conn.cursor()
#    recs = c.execute("SELECT sng.song_text, sng.description, usr.name FROM song sng LEFT OUTER JOIN user usr ON usr.uid = sng.uid ORDER BY RANDOM() LIMIT %s" % (song_num)).fetchall()
    recs = c.execute("SELECT song_id, song_text, description, name, date(created_at) FROM song ORDER BY RANDOM() LIMIT ?", (song_num)).fetchall()
    cols = ("song_id", "song_text", "description", "name", "created_at")
    ret = []
    for row in recs:
        ret.append(dict(zip(cols, row)))
    return json.dumps(ret)

@post("/api/save_song")
def save_song():
    params = request.params.decode()
    song_text = params.get("song_text")
    description = params.get("description")
    name = params.get("name")
#    with open('./songs.txt', 'a') as f:
#        f.write(params.get('song') + ' by ' + name + os.linesep)
#    response.content_type = 'application/json'
    conn = sqlite3.connect(CONST.DB)
    c = conn.cursor()
#    uid = c.execute("SELECT uid from user where name = ?", (name)).fetchone()[0]
#    if not uid:
#        c.execute("INSERT INTO user (name, created) VALUES (?, datetime())", (name))
#        uid = c.execute("SELECT uid from user where name = ?", (name)).fetchone()[0]
#    c.execute("INSERT INTO song (song_text, description, uid, created) VALUES (?, ?, ?, datetime())", (song_text, description, uid))

    if c.execute("SELECT 1 FROM song where replace(replace(replace(song_text, ' ', ''), '　', ''), '	', '') = ?", [re.sub(r"[ 　	]", "", song_text)]).fetchone():
        response.status = 911
        return

    c.execute("INSERT INTO song (song_text, description, name, created_at, created_by) VALUES (?, ?, ?, datetime(), ?)", (song_text, description, name, name))
    conn.commit()
    c.close()
    return {}

run(host="127.0.0.1",
    port=***,
    debug=False,
    reloader=False)
