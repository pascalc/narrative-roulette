import logging

import flask
from flask import request, url_for

from handlers import app
import db.query as q

def redirect(target, **kwargs):
  referer = request.headers.get("Referer")
  url = target
  if referer:
    url = "%s/%s" % (referer, target)
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
