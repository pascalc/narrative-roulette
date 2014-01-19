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

Session = orm.sessionmaker(bind=db.engine)
session = orm.scoped_session(Session)

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
  
  # Round = latest round before created_at with correct perspective_id
  @hybrid_property
  def round_id(self):
    try:
      return session.query(Round)\
        .filter(Round.start_time < self.created_at)\
        .filter(Round.perspective_id == self.perspective_id)\
        .order_by(desc(Round.start_time))\
        .first()\
        .id
    except AttributeError:
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
    return [s.to_dict() for s in session.query(Submission)\
      .filter(Submission.created_at >= self.start_time)\
      .filter(Submission.perspective_id == self.perspective_id)\
      .all()]

  def __repr__(self):
    return "Round %s" % self.id

Base.metadata.create_all()
logging.info("Table information loaded")
