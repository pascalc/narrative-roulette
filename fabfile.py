from fabric.api import *

def deploy():
  code_path = '/home/ubuntu/narrative-roulette'
  with cd(code_path):
    run('git pull origin master')
