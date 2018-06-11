from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
import re
import os.path
import time

class S(BaseHTTPRequestHandler):
    def _set_headers_ok(self):
        self.send_response(200)
        if re.match('.*\.htm$', self.path):
            self.send_header('Content-Type', 'text/html')
        elif re.match('.*\.json$', self.path):
            self.send_header('Content-Type', 'application/json')
        else:
            self.send_header('Content-Type', 'text/html')
        self.send_header('Content-Length', os.path.getsize("." + self.path))
        self.end_headers()

    def _set_headers_nok(self):
        self.send_response(500)
        self.end_headers()

    def do_GET(self):    
        time.sleep(1)    
        fname = "." + self.path
        if os.path.isfile(fname):
            self._set_headers_ok()
            page_obj = open(fname, 'r') 
            self.wfile.write(page_obj.read())
        else:
            self._set_headers_nok()
            self.wfile.write("<html><body><h1>Page do not exist</h1></body></html>")

    def do_HEAD(self):
        self._set_headers_ok()
        
    def do_POST(self):
        time.sleep(1)
        # Doesn't do anything with posted data
        self._set_headers_ok()
        self.wfile.write("{ \"acknolowedged\": true }")

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