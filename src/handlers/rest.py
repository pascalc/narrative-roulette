import flask
import flask.ext.sqlalchemy
import flask.ext.restless

import db
import db.schema as schema
import db.query as query

# API

# Create the Flask application and the Flask-SQLAlchemy object.
app = flask.Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = db.connection_string

# Create the Flask-Restless API manager.
manager = flask.ext.restless.APIManager(app, session=query.session)

# Create API endpoints, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well.
manager.create_api(schema.Round, methods=["GET", "POST", "PUT", "DELETE"])
manager.create_api(schema.Perspective, methods=["GET", "POST", "PUT", "DELETE"])
manager.create_api(schema.Submission, methods=["GET", "POST", "PUT", "DELETE"])

# ADMIN

from flask.ext.admin import Admin
from flask.ext.admin.contrib.sqla import ModelView

admin = Admin(app, url="/api/admin")
admin.add_view(ModelView(schema.Round, query.session))
admin.add_view(ModelView(schema.Perspective, query.session))
admin.add_view(ModelView(schema.Submission, query.session))
