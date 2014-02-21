import logging
from datetime import datetime
from copy import deepcopy

import sqlalchemy as sql
from sqlalchemy import Table, Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy import orm, func, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property

import db

Base = declarative_base()
Base.metadata.bind = db.engine

Session = orm.sessionmaker(bind=db.engine, autocommit=True)
def new_session():
  return orm.scoped_session(Session)
session = new_session()

class MyMixin(object):
  def to_dict(self):
    d = deepcopy(self.__dict__)
    del d['_sa_instance_state']
    return d

class Perspective(Base, MyMixin):
  __tablename__ = 'perspective'
  id = Column(Integer, primary_key=True)
  gender = Column(String(6), nullable=False)
  text = Column(Text, nullable=False)
  social_text = Column(Text, nullable=True)
  created_at = Column(DateTime, default=datetime.now)
  submissions = orm.relationship('Submission', backref='perspective',
                                lazy='dynamic')
  rounds = orm.relationship('Round', backref='perspective',
                                lazy='dynamic')

  def __repr__(self):
    return "%s, %s" % (self.gender, self.text)

class Submission(Base, MyMixin):
  __tablename__ = 'submission'
  id = Column(Integer, primary_key=True)
  perspective_id = Column(Integer, ForeignKey('perspective.id'), nullable=False)
  text = Column(Text, nullable=False)
  likes = Column(Integer, default=0)
  created_at = Column(DateTime, default=datetime.now)
  fb_post_id = Column(String(128), nullable=True)
  
  # Round = latest round before created_at with correct perspective_id
  @hybrid_property
  def round_id(self):
    session = new_session()
    try:
      result = session.query(Round)\
        .filter(Round.start_time < self.created_at)\
        .filter(Round.perspective_id == self.perspective_id)\
        .order_by(desc(Round.start_time))\
        .first()\
        .id
      session.close()
      return result
    except AttributeError:
      session.close()
      return None

  def __repr__(self):
    return "Submission %s" % self.id

class Round(Base, MyMixin):
  __tablename__ = 'round'
  id = Column(Integer, primary_key=True)
  start_time = Column(DateTime, default=datetime.now)
  perspective_id = Column(Integer, ForeignKey('perspective.id'), nullable=False)

  @hybrid_property
  def submissions(self):
    session = new_session()
    later_round = session.query(Round)\
      .filter(Round.start_time > self.start_time)\
      .filter(Round.perspective_id == self.perspective_id)\
      .first()
    
    subs = session.query(Submission)\
      .filter(Submission.created_at >= self.start_time)
    if later_round:
      subs = subs.filter(Submission.created_at < later_round.start_time)
    subs = subs.filter(Submission.perspective_id == self.perspective_id).all()
    session.close()
    return [s.to_dict() for s in subs]

  def __repr__(self):
    return "Round %s" % self.id

Base.metadata.create_all()
logging.info("Table information loaded")
