import flask

from handlers import app
import db.query as q

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/api/perspective/random')
def random_perspective():
  return flask.jsonify(
    q.random_perspective().to_dict()
  )
