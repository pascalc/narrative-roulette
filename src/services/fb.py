import logging
import urllib

import config
import facebook
from pprint import pprint

from bs4 import BeautifulSoup as BS

graph = facebook.GraphAPI(config.fb_graph_api['page_access_token'])

def post_object_to_page(obj):
  return graph.put_object("/narrativeroulette", "feed", **obj)

def get_submission_text(html): 
  html = html.replace('&nbsp;', '')
  parsed = BS(html)
  for br in parsed.findAll("br"):
    br.replaceWith("\n\n")
  return parsed.get_text()

def fb_perspective_text(perspective):
  gender = perspective['gender']
  text = perspective['text'].replace("\n", "");
  return u"Imagine this: You are {gender}. {text} What's going through your head?\n ---\n\n"\
    .format(gender=gender, text=text)

def encode_params(obj):
  return dict([k, v.encode('utf-8')] for k, v in obj.items())

def post_submission(sub):
  logging.info("Posting submission %s to Facebook" % sub)
  sub_body = get_submission_text(sub['text'])
  logging.info("Submission body for FB:\n %s " % sub_body)
  fb_obj = {
    'message': fb_perspective_text(sub['perspective']) + sub_body,
    'link': u"http://narrativeroulette.com#/submission/%s" % sub['id'],
    'picture': u"http://narrativeroulette.com/img/typewriter_fb.jpg",
    'name': u'Play Narrative Roulette',
    'caption': u"Who will you be?",
    'description': u"Write an anonymous narrative from a perspective radically different from your own. See the world through another pair of eyes and the effect might last longer than the time you spend on the page.",
  }
  fb_obj = encode_params(fb_obj)
  logging.info("FB post object:\n %s " % fb_obj)
  response = post_object_to_page(fb_obj)
  logging.info("Posted submission %s to Facebook" % sub['id'])
  return response
