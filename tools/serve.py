"""Serve the working copy like GitHub Pages does: "/product" answers with product.html.
    python3 tools/serve.py [PORT] [HOST]   (default 8000, 127.0.0.1)

Tuned for slow links (VS Code port forwarding, Tailscale):
  - HTTP/1.1 keep-alive, so the ~25 files of a page reuse one connection
  - gzip for text files (html/css/js/json/svg)
  - files requested with ?v=... are cached by the browser (update-versions.py
    changes the number when the file changes); everything else is revalidated
    every time, so edits still show up on a plain reload
HOST: pass the Tailscale address (tailscale ip -4) to reach it from your own
tailnet devices only. Never pass 0.0.0.0.
"""
import email.utils, gzip, http.server, io, os, sys

TEXT_TYPES = ("text/", "application/javascript", "application/json", "image/svg+xml")


class Handler(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path != "/" and not path.endswith("/") and "." not in os.path.basename(path):
            if os.path.isfile(self.translate_path(path + ".html")):
                self.path = path + ".html" + self.path[len(path):]
        fs_path = self.translate_path(self.path)
        if os.path.isdir(fs_path):
            index = os.path.join(fs_path, "index.html")
            if self.path.split("?", 1)[0].endswith("/") and os.path.isfile(index):
                fs_path = index
        ctype = self.guess_type(fs_path)
        if (os.path.isfile(fs_path) and ctype.startswith(TEXT_TYPES)
                and "gzip" in self.headers.get("Accept-Encoding", "")):
            return self.send_gzip(fs_path, ctype)
        return super().send_head()

    def send_gzip(self, fs_path, ctype):
        mtime = int(os.path.getmtime(fs_path))
        ims = self.headers.get("If-Modified-Since")
        if ims:
            try:
                if int(email.utils.parsedate_to_datetime(ims).timestamp()) >= mtime:
                    self.send_response(304)
                    self.send_header("Content-Length", "0")
                    self.end_headers()
                    return None
            except (TypeError, ValueError):
                pass
        with open(fs_path, "rb") as f:
            body = gzip.compress(f.read(), 6)
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Encoding", "gzip")
        self.send_header("Vary", "Accept-Encoding")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Last-Modified", self.date_time_string(mtime))
        self.end_headers()
        return io.BytesIO(body)

    def end_headers(self):
        if "?v=" in self.path:
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        else:
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    host = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"
    if host == "0.0.0.0":
        sys.exit("0.0.0.0 would expose the site to every network; use 127.0.0.1 or the Tailscale IP")
    http.server.ThreadingHTTPServer((host, port), Handler).serve_forever()
