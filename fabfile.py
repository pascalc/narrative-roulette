from fabric.api import *

def deploy():
  code_path = '/home/ubuntu/kg-narrative-roulette'
  with cd(code_path):
    run('git pull origin kg')
