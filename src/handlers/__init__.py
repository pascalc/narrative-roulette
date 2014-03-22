import flask
import flask.ext.sqlalchemy

app = flask.Flask(__name__,
  static_url_path="",
)
app.secret_key = 'trollolol'
