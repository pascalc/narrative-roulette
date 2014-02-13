import logging
import os
import sqlalchemy as sql

from config import db_credentials

# Localhost 

HOST = db_credentials['host']
USERNAME = db_credentials['username']
PASSWORD = db_credentials['password']
DB_NAME = db_credentials['db_name']

connection_string = \
  "mysql://{user}:{password}@{host}/{db}?charset=utf8".format(
    user=USERNAME,
    host=HOST,
    password=PASSWORD,
    db=DB_NAME
  )

"""
Google App Engine
"""

# INSTANCE_NAME = db_credentials['instance_name']
# DB_NAME = db_credentials['db_name']
# USERNAME = db_credentials['username']
# PASSWORD = db_credentials['password']

# connection_string = None
# if os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine'):
#   connection_string = 'mysql+gaerdbms:///%s?instance=%s?charset=utf8' % (DB_NAME, INSTANCE_NAME)
# else:
#   connection_string = sql.engine.url.URL(
#       "mysql+mysqldb",
#       username=USERNAME,
#       password=PASSWORD,
#       host=db_credentials['ip_address'],
#       database=DB_NAME,
#     )

# logging.info("SQLAlchemy connection string: %s" % connection_string)
engine = sql.create_engine(connection_string)
