from fabric.api import *

path = '/home/ubuntu/kg-narrative-roulette'

def deploy():
  with cd(path):
    run('git pull origin kg')

def restart():
  with cd(path):
    run('sudo supervisorctl restart kg-narrative-roulette')
