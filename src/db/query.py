import logging
import functools

import sqlalchemy.orm as orm
import sqlalchemy.sql as sql
from sqlalchemy import desc

import db
import db.schema
from db.schema import *

def with_session():
    """ Decorator for using correct session in a function.
    """
    def decorator(method):
        @functools.wraps(method)
        def wrapper(*args, **kwargs):
            if '__self__' in dir(method):
                name = method.__self__.__name__
            elif '__module__' in dir(method):
                name = method.__module__
            else:
                name = ""
            name += "#" + method.__name__

            session = 'session' in kwargs and kwargs['session']
            if session:
              logging.debug("%s using given session" % name)
            else:
              logging.debug("%s using db.schema.session" % name)
              kwargs['session'] = db.schema.session
            result = method(*args, **kwargs)
            return result
        return wrapper
    return decorator

@with_session()
def random_perspective(session=None):
  return session.query(Perspective)\
    .order_by(sql.func.rand())\
    .limit(1)\
    .first()

@with_session()
def latest_round(session=None):
  return session.query(Round)\
    .filter(Round.start_time <= datetime.utcnow())\
    .order_by(desc(Round.start_time))\
    .limit(1)\
    .first()

@with_session()
def update_submission_fb_post_id(sub_id, fb_post_id, session=None):
  logging.info("Setting fb_post_id to %s for submission %s" % (fb_post_id, sub_id))
  result = session.query(Submission)\
    .filter(Submission.id == sub_id)\
    .update({'fb_post_id': fb_post_id})
  session.commit()
  logging.info("Set fb_post_id to %s for submission %s" % (fb_post_id, sub_id))
  return result
