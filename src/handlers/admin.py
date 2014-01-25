from flask.ext.admin import Admin
from flask.ext.admin.contrib.sqla import ModelView

import db.schema as schema
import db.query as query
from handlers.rest import app

admin = Admin(app, url="/admin")

class RoundModelView(ModelView):
  column_list = ('id', 'perspective', 'start_time')
  def __init__(self, name=None, category=None, endpoint=None, url=None, **kwargs):
    for k, v in kwargs.iteritems():
      setattr(self, k, v)

    super(RoundModelView, self).__init__(
      schema.Round, 
      query.session, 
      name=name, 
      category=category, 
      endpoint=endpoint, 
      url=url
    )

class PerspectiveModelView(ModelView):
  form_columns = \
    ('gender', 
     'text')

  column_list = ('id', 'gender', 'text', 'created_at')

  def __init__(self, name=None, category=None, endpoint=None, url=None, **kwargs):
    for k, v in kwargs.iteritems():
      setattr(self, k, v)

    super(PerspectiveModelView, self).__init__(
      schema.Perspective, 
      query.session, 
      name=name, 
      category=category, 
      endpoint=endpoint, 
      url=url
    )

class SubmissionModelView(ModelView):
  column_list = ('id', 'perspective_id', 'round_id', 'text', 'fb_post_id', 'likes', 'created_at')
  def __init__(self, name=None, category=None, endpoint=None, url=None, **kwargs):
    for k, v in kwargs.iteritems():
      setattr(self, k, v)

    super(SubmissionModelView, self).__init__(
      schema.Submission, 
      query.session, 
      name=name, 
      category=category, 
      endpoint=endpoint, 
      url=url
    )

admin.add_view(RoundModelView())
admin.add_view(PerspectiveModelView())
admin.add_view(SubmissionModelView())
