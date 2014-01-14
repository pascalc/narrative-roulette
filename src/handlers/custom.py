from handlers import app

@app.route('/hello')
def index():
  return 'Yo, dawg'
