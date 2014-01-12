from flask.ext.admin import Admin
from flask.ext.admin.contrib.sqla import ModelView

import db.schema as schema
import db.query as query
from handlers.rest import app

admin = Admin(app, url="/api/admin")

class RoundModelView(ModelView):
  form_columns = \
    ('start_time', 
     'end_time',
     'duration_secs')

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

admin.add_view(RoundModelView())
admin.add_view(PerspectiveModelView())
admin.add_view(ModelView(schema.Submission, query.session))
