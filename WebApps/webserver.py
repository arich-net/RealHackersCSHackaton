from http.server import BaseHTTPRequestHandler, HTTPServer
import socketserver
import re
import os.path
import time
import json
from urllib.parse import urlparse
from urllib.parse import parse_qs
from urllib.parse import unquote

class S(BaseHTTPRequestHandler):
    def _set_headers_ok(self):
        parsed = urlparse(self.path)
        self.send_response(200)
        if re.match(r'.*\.htm$', parsed.path):
            self.send_header('Content-Type', 'text/html')
        elif re.match(r'.*\.json$', parsed.path):
            self.send_header('Content-Type', 'application/json')
        else:
            self.send_header('Content-Type', 'text/html')
        self.send_header('Content-Length', os.path.getsize("." + parsed.path))
        self.end_headers()

    def _set_headers_nok(self):
        self.send_response(500)
        self.end_headers()

    def do_GET(self):    
        time.sleep(1)
        parsed = urlparse(self.path)
        if parsed.query:
            print('----------------------------------')
            print("** GET parameters received:")
            print('Query:' + json.dumps(parse_qs(unquote(parsed.query)))) 
            print('----------------------------------')
        fname = "." + parsed.path
        if os.path.isfile(fname):
            self._set_headers_ok()
            page_obj = open(fname, 'r') 
            self.wfile.write(bytes(page_obj.read().encode('utf-8')))
        else:
            self._set_headers_nok()
            self.wfile.write(bytes("<html><body><h1>Page do not exist</h1></body></html>".encode('utf-8')))

    def do_HEAD(self):
        self._set_headers_ok()
        
    def do_POST(self):
        time.sleep(1)
        # Doesn't do anything with posted data        
        self._set_headers_ok()
        length = int(self.headers.get('content-length'))
        contenttype = self.headers.get('content-type')
        postdata = self.rfile.read(length).decode('utf-8')
        print('----------------------------------')
        if (re.match(r'application/json',contenttype)):
            print('** JSON POST data received: ')
            print(json.dumps(json.loads(postdata), sort_keys=True, indent=4))
        else:
            print('** POST data received: ' + postdata)
        print('----------------------------------')
        self.wfile.write(bytes("{ \"acknolowedged\": true }".encode('utf-8')))

def run(server_class=HTTPServer, handler_class=S, port=80):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print('Starting httpd...')
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()