import logging

import flask.ext.restless

import db
import db.schema as schema
import db.query as query

from handlers import app
import services.fb as fb

# Create the Flask application and the Flask-SQLAlchemy object.
# app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = db.connection_string

manager = flask.ext.restless.APIManager(app, session=schema.session)

# POST /submission post-processor
def post_submission_postprocessor(result=None, **kw):
  """Accepts a single argument, `result`, which is the dictionary
  representation of the created instance of the model.
  """
  session = schema.new_session()
  submission = result
  logging.info("Entered POST submission %s postprocessor" % submission['id'])
  
  # Post submission to Facebook
  fb_response = fb.post_submission(submission)
  # Insert fb_post_id into Database
  query.update_submission_fb_post_id(submission['id'], fb_response['id'], session=session)
  session.close()
  # Insert fb_post_id into outgoing result
  result['fb_post_id'] = fb_response['id']

  logging.info("Finished POST submission %s postprocessor" % submission['id'])

# Create API endpoints, which will be available at /api/<tablename> by
# default. Allowed HTTP methods can be specified as well.
manager.create_api(schema.Round, methods=["GET"])
manager.create_api(schema.Perspective, methods=["GET"])
manager.create_api(schema.Submission, methods=["GET", "POST"])
