import flask
import flask.ext.sqlalchemy

app = flask.Flask(__name__,
  static_url_path=None,
)
app.secret_key = 'trollolol'
