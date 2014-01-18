import logging

import sqlalchemy.orm as orm
import sqlalchemy.sql as sql

import db
from db.schema import *

Session = orm.sessionmaker(bind=db.engine)
session = orm.scoped_session(Session)

def random_perspective():
  return session.query(Perspective)\
    .order_by(sql.func.rand())\
    .limit(1)\
    .first()
