"""Phone preview: the site inside a phone-sized frame, for checking mobile layouts from a desktop browser
(e.g. over VS Code port forwarding).
    python3 tools/phone.py [PORT]      (default 8001; listens on 127.0.0.1 only)
Open "/" for the frame. Everything else is served exactly like tools/serve.py, so links inside the frame work.
The frame only sets the width: touch, the phone's browser bars and device fonts are not emulated.
"""
import os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import serve  # noqa: E402

FRAME = """<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Phone preview</title>
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; min-height: 100vh; background: #e9edf2; font: 14px system-ui, sans-serif; color: #1b2330;
         display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 18px 16px 28px; box-sizing: border-box; }
  @media (prefers-color-scheme: dark) { body { background: #151a22; color: #d9e0ea; } }
  .bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; justify-content: center; }
  button { font: inherit; padding: 6px 12px; border-radius: 8px; border: 1px solid #9aa6b5; background: transparent; color: inherit; cursor: pointer; }
  button[aria-pressed="true"] { background: #1765cc; border-color: #1765cc; color: #fff; }
  .phone { border: 10px solid #0d1117; border-radius: 34px; overflow: hidden; background: #fff;
           box-shadow: 0 18px 50px rgba(0,0,0,.25); flex: none; }
  iframe { display: block; border: 0; }
  .size { opacity: .7; min-width: 90px; text-align: center; }
</style></head>
<body>
  <div class="bar" id="sizes"></div>
  <div class="bar">
    <button type="button" id="rotate">가로/세로</button>
    <button type="button" id="reload">새로고침</button>
    <span class="size" id="label"></span>
  </div>
  <div class="phone" id="phone"><iframe id="f" src="index.html" title="Site preview"></iframe></div>
<script>
  const sizes = [["작은 폰", 360, 780], ["iPhone 15", 390, 844], ["큰 폰", 430, 932], ["태블릿 세로", 768, 1024]];
  const f = document.getElementById('f'), label = document.getElementById('label'), box = document.getElementById('sizes');
  let cur = 1, land = false;
  function apply() {
    let [, w, h] = sizes[cur]; if (land) [w, h] = [h, w];
    const maxH = window.innerHeight - 130;
    f.style.width = w + 'px'; f.style.height = Math.min(h, Math.max(400, maxH)) + 'px';
    label.textContent = w + ' × ' + h;
    box.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', i === cur));
  }
  sizes.forEach(([name], i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = name;
    b.onclick = () => { cur = i; apply(); }; box.appendChild(b);
  });
  document.getElementById('rotate').onclick = () => { land = !land; apply(); };
  document.getElementById('reload').onclick = () => f.contentWindow.location.reload();
  addEventListener('resize', apply); apply();
</script>
</body></html>
""".encode("utf-8")


class Handler(serve.Handler):
    def send_head(self):
        path = self.path.split("?", 1)[0]
        # The frame lives at "/"; the site's own links to "/" (home) arrive from inside the iframe, so they get the site.
        if path == "/" and self.headers.get("Sec-Fetch-Dest") != "iframe":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(FRAME)))
            self.end_headers()
            import io
            return io.BytesIO(FRAME)
        return super().send_head()


if __name__ == "__main__":
    os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    serve.http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
