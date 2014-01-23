import config
import facebook
from pprint import pprint

graph = facebook.GraphAPI(config.fb_graph_api['page_access_token'])

if __name__=="__main__":
  pprint(graph.get_object("1456629574556785_1456911441195265"))
