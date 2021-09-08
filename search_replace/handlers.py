import json
from re import search

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

class RouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /search-replace/get_search_string endpoint!"
        }))

    #mock stuff cuz we have nothing implemented on the backend yet
    @tornado.web.authenticated
    def post(self):
        data = self.get_json_body()
        search = data.get('search', 'mariana')
        self.finish(json.dumps({
            "files": [
                {
                    "path": "file/path/dummy.tx",
                    "found": [
                        {
                            "string": f"foo {search}",
                            "line": 23,
                            "column": 4
                        }
                    ]
                }
            ]
        }))
#this handler stuff, each handler must have their own rout_pattern
#and possibly their own other things
#one thing I thought it was weird is that you can only have one post and one
#get method, etc for each app, that doesn't make sense
#but Fred said that, so yeah, I don't get it
def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "search-replace", "get_search_string")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
