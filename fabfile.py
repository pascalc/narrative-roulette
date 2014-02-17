from fabric.api import *

path = '/home/ubuntu/narrative-roulette'

def deploy():
  with cd(path):
    run('git pull origin master')

def restart():
  with cd(path):
    run('sudo supervisorctl restart narrative-roulette')
