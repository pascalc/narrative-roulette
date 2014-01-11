import logging
from datetime import datetime

import sqlalchemy as sql
from sqlalchemy import Table, Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy import orm
from sqlalchemy.ext.declarative import declarative_base

import db

Base = declarative_base()
Base.metadata.bind = db.engine

class Round(Base):
  __tablename__ = 'round'
  id = Column(Integer, primary_key=True)
  start_time = Column(DateTime, default=datetime.now)
  end_time = Column(DateTime, nullable=False)
  duration_secs = Column(Integer, nullable=False)
  submissions = orm.relationship('Submission', backref='round',
                                lazy='dynamic')

class Perspective(Base):
  __tablename__ = 'perspective'
  id = Column(Integer, primary_key=True)
  gender = Column(String(6), nullable=False)
  text = Column(Text, nullable=False)
  created_at = Column(DateTime, default=datetime.now)
  submissions = orm.relationship('Submission', backref='perspective',
                                lazy='dynamic')

class Submission(Base):
  __tablename__ = 'submission'
  id = Column(Integer, primary_key=True)
  perspective_id = Column(Integer, ForeignKey('perspective.id'), nullable=False)
  round_id = Column(Integer, ForeignKey('round.id'), nullable=False)
  text = Column(Text, nullable=False)
  likes = Column(Integer, default=0)

Base.metadata.create_all()
logging.info("Table information loaded")
