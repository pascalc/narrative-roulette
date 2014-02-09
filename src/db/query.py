import logging

import sqlalchemy.orm as orm
import sqlalchemy.sql as sql
from sqlalchemy import desc

import db
from db.schema import *

def random_perspective():
  return session.query(Perspective)\
    .order_by(sql.func.rand())\
    .limit(1)\
    .first()

def latest_round():
  return session.query(Round)\
    .filter(Round.start_time <= datetime.utcnow())\
    .order_by(desc(Round.start_time))\
    .limit(1)\
    .first()

def update_submission_fb_post_id(sub_id, fb_post_id):
  logging.info("Setting fb_post_id to %s for submission %s" % (fb_post_id, sub_id))
  result = session.query(Submission)\
    .filter(Submission.id == sub_id)\
    .update({'fb_post_id': fb_post_id})
  session.commit()
  logging.info("Set fb_post_id to %s for submission %s" % (fb_post_id, sub_id))
  return result
