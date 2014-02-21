import logging

import flask
from flask import request, url_for, render_template

from handlers import app
import db.query as q
import db.schema
from db.schema import *

def redirect(target, **kwargs):
  referer = request.headers.get("Referer")
  url = target
  if referer:
    url = referer + target[1:]
  return flask.redirect(url)

@app.before_request
def open_session():
  logging.info("Opening sessions")
  flask.g.session = new_session()
  db.schema.session = new_session()

@app.teardown_request
def close_session(response):
  logging.info("Closing sessions")
  flask.g.session.close()
  db.schema.session.close()
  return response

@app.errorhandler(500)
def rollback_session(error):
  logging.error(error)
  logging.info("Rolling back sessions")
  flask.g.session.rollback()
  db.schema.session.rollback()
  flask.abort(500)

@app.route('/')
def index():
  latest_round = q.latest_round(session=flask.g.session)
  latest_perspective = latest_round.perspective.to_dict()
  latest_submissions = latest_round.submissions
  
  info = latest_round.to_dict()
  info['perspective'] = latest_perspective
  info['submissions'] = latest_submissions
  return render_template("index.html", latest_round=info)

# Redirect based on ORIGIN header

@app.route('/api/perspective/random')
def random_perspective():
  random_id = q.random_perspective(session=flask.g.session).id
  return redirect('/api/perspective/%s' % random_id)

@app.route('/api/round/latest')
def latest_round():
  round_id = q.latest_round(session=flask.g.session).id
  return redirect("/api/round/%s" % round_id)

@app.route('/submission/<int:submission_id>')
def serverside_submission(submission_id=None):
  logging.info("Rendering submission server-side")
  sub = flask.g.session.query(Submission).filter(Submission.id == submission_id)[0]
  return render_template("submission.html", submission=sub)
