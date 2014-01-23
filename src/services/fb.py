import config
import facebook
from pprint import pprint

from bs4 import BeautifulSoup as BS

graph = facebook.GraphAPI(config.fb_graph_api['page_access_token'])

def post_object_to_page(obj):
  return graph.put_object("/narrativeroulette", "feed", **obj)

def get_submission_text(html): 
  parsed = BS(html)
  for br in parsed.findAll("br"):
    br.replaceWith("\n\n")
  return parsed.get_text()

sub_html = "Hell yeah! After 9 insanely long months I'm crawling! I'm crawling out of my mothers womb for gods sake! Is there anything like this, and will there ever be? I don't want this feeling to end, ever!<div><br></div><div>Oh shit! There's a this wall! No one mentioned this wall. Not even my mother told me it while stroking me through her skin, who's now screaming random noises. It seems easier to here what she says when I'm not turning my ass towards the wall, so I better spin around to face the wall.</div><div><br></div><div>Wait! It seems there's this super tiny opening exposing light. The light is bright! Is this it? Is this the end? Even though this might be, this is pretty worth it. It really is the ride of my life and I better walk the line. It seems I can push the tiny opening and make it bigger!</div><div><br></div><div>Oh my lord! I'm out somewhere! I think I see myself from outside and have the greatest out of body experience ever!</div><div><br></div><div>I'm on the other side of life!</div>"

def post_submission():
  sub_body = get_submission_text(sub_html)
  fb_obj = {
    'message': "Imagine this: You are male. You've just emerged from the womb. What's going through your head?\n\n" + sub_body,
    'link': "http://narrativeroulette.com#/submission/19",
    'picture': "http://narrativeroulette.com/img/typewriter_fb.jpg",
    'name': 'Play Narrative Roulette',
    'caption': "Who will you be?",
    'description': "Write an anonymous narrative from a perspective radically different from your own. See the world through another pair of eyes and the effect might last longer than the time you spend on the page.",
  }
  return post_object_to_page(fb_obj)
