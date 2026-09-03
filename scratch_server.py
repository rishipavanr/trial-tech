import http.server
import socketserver
import urllib.parse
import threading
import os
import webbrowser
import time

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/log?msg='):
            msg = urllib.parse.unquote(self.path.split('msg=')[1])
            print("BROWSER LOG:", msg)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"OK")
            # Shutdown server after getting log
            threading.Thread(target=self.server.shutdown).start()
        else:
            super().do_GET()

with socketserver.TCPServer(("", 8086), MyHandler) as httpd:
    print("Serving at port 8086")
    def open_browser():
        time.sleep(1)
        os.system('start msedge http://localhost:8086/scratch_test.html --headless')
    threading.Thread(target=open_browser).start()
    httpd.serve_forever()
