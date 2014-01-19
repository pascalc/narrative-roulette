import flask

from handlers import app
import db.query as q

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/api/perspective/random')
def random_perspective():
  random_id = q.random_perspective().id
  return flask.redirect('/api/perspective/%s' % random_id)

@app.route('/api/round/latest')
def latest_round():
  round_id = q.latest_round().id
  return flask.redirect("/api/round/%s" % round_id)
