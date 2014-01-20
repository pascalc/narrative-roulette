import logging
import os
import sqlalchemy as sql

# Localhost 

HOST = "localhost"
USERNAME = "root"
PASSWORD = ""
DB_NAME = "narrative_roulette"

connection_string = \
  "mysql://{user}:{password}@{host}/{db}".format(
    user=USERNAME,
    host=HOST,
    password=PASSWORD,
    db=DB_NAME
  )

engine = sql.create_engine(connection_string)
