"""Serve the working copy like GitHub Pages does: "/product" answers with product.html.
    python3 tools/serve.py [PORT]      (default 8000; listens on 127.0.0.1 only)
"""
import http.server, os, sys


class Handler(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path != "/" and not path.endswith("/") and "." not in os.path.basename(path):
            if os.path.isfile(self.translate_path(path + ".html")):
                self.path = path + ".html" + self.path[len(path):]
        return super().send_head()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
