import logging

import flask
from flask import request, url_for, render_template

from handlers import app
import db.query as q
from db.schema import *

def redirect(target, **kwargs):
  referer = request.headers.get("Referer")
  url = target
  if referer:
    url = referer + target[1:]
  return flask.redirect(url)

@app.route('/')
def index():
  return app.send_static_file('index.html')

# Redirect based on ORIGIN header

@app.route('/api/perspective/random')
def random_perspective():
  random_id = q.random_perspective().id
  return redirect('/api/perspective/%s' % random_id)

@app.route('/api/round/latest')
def latest_round():
  round_id = q.latest_round().id
  return redirect("/api/round/%s" % round_id)

@app.route('/submission/<int:submission_id>')
def serverside_submission(submission_id=None):
  logging.info("Rendering submission server-side")
  sub = session.query(Submission).filter(Submission.id == submission_id)[0]
  return render_template("submission.html", submission=sub)
