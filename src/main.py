# Flask
from handlers.rest import app
import handlers.admin
import handlers.custom

# Tornado WebSocket handler
from handlers.socket import WSHandler

# Tornado
import tornado.wsgi
import tornado.ioloop
import tornado.web

app.debug
# app.run(port=5000)

container = tornado.wsgi.WSGIContainer(app)
application = tornado.web.Application([
  (r"/ws", WSHandler),
  (r".*", tornado.web.FallbackHandler, dict(fallback=container)),
])

if __name__ == "__main__":
  application.listen(5000)
  tornado.ioloop.IOLoop.instance().start()
