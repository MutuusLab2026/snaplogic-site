"""Phone preview: the site inside a phone-sized frame, for checking mobile layouts from a desktop browser
(e.g. over VS Code port forwarding).
    python3 tools/phone.py [PORT]      (default 8001; listens on 127.0.0.1 only)
Open "/" for the frame. Everything else is served exactly like tools/serve.py, so links inside the frame work.
The frame only sets the width: touch, the phone's browser bars and device fonts are not emulated.
"""
import os, sys

sys.dont_write_bytecode = True   # no tools/__pycache__ in the repo
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
  /* iPhone-like status bar: takes its colour from the top of the page, as Safari does */
  .sb { height: 47px; display: flex; align-items: center; justify-content: space-between; padding: 0 26px 0 34px;
        box-sizing: border-box; background: #0d1626; color: #fff; position: relative; transition: background .2s, color .2s;
        font: 600 16px -apple-system, "SF Pro Text", system-ui, sans-serif; letter-spacing: -.2px; }
  .sb .island { position: absolute; left: 50%; top: 11px; width: 120px; height: 34px; margin-left: -60px;
                background: #000; border-radius: 20px; }
  .sb .icons { display: flex; gap: 6px; align-items: center; }
  .sb svg { display: block; fill: currentColor; }
  .phone.land .sb { display: none; }
  .size { opacity: .7; min-width: 90px; text-align: center; }
  /* The page's own scrollbar is hidden (phones barely show one); this one sits outside the phone instead */
  .wrap { display: flex; align-items: center; gap: 14px; }
  .wrap > .pad { width: 10px; flex: none; }
  .ext { position: relative; width: 10px; flex: none; border-radius: 5px; background: rgba(125,139,153,.22); cursor: pointer; touch-action: none; }
  .ext i { position: absolute; left: 0; right: 0; top: 0; min-height: 28px; border-radius: 5px; background: #7d8b99; }
  .ext:hover i, .ext.drag i { background: #5b6e7f; }
</style></head>
<body>
  <div class="bar" id="sizes"></div>
  <div class="bar">
    <button type="button" id="rotate">가로/세로</button>
    <button type="button" id="reload">새로고침</button>
    <span class="size" id="label"></span>
  </div>
  <div class="wrap"><div class="pad"></div><div class="phone" id="phone"><div class="sb" id="sb" aria-hidden="true"><span id="clock">9:41</span><span class="island"></span><span class="icons">
    <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
    <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.3A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .5 3.4l1.3 1.3A8.7 8.7 0 0 1 8 2.2Zm0 3.7c1.4 0 2.7.5 3.6 1.4l1.3-1.3A7 7 0 0 0 8 4a7 7 0 0 0-4.9 2l1.3 1.3c.9-.9 2.2-1.4 3.6-1.4Zm0 3.6c-.5 0-1 .2-1.3.6L8 11.4l1.3-1.3c-.3-.4-.8-.6-1.3-.6Z"/></svg>
    <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2"/><path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2Z" opacity=".4"/></svg>
  </span></div><iframe id="f" src="index.html" title="Site preview"></iframe></div><div class="ext" id="ext" aria-hidden="true"><i id="thumb"></i></div></div>
<script>
  const sizes = [["작은 폰", 360, 780], ["iPhone 15", 390, 844], ["큰 폰", 430, 932], ["태블릿 세로", 768, 1024]];
  const f = document.getElementById('f'), label = document.getElementById('label'), box = document.getElementById('sizes');
  let cur = 1, land = false;
  function apply() {
    let [, w, h] = sizes[cur]; if (land) [w, h] = [h, w];
    const maxH = window.innerHeight - 130;
    document.getElementById('phone').classList.toggle('land', land);
    const bar = land ? 0 : 47;   // the status bar is part of the screen height
    f.style.width = w + 'px'; f.style.height = Math.min(h, Math.max(400, maxH)) - bar + 'px';
    label.textContent = w + ' × ' + h;
    box.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', i === cur));
    if (typeof sync === 'function') requestAnimationFrame(sync);
  }
  sizes.forEach(([name], i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = name;
    b.onclick = () => { cur = i; apply(); }; box.appendChild(b);
  });
  document.getElementById('rotate').onclick = () => { land = !land; apply(); };
  document.getElementById('reload').onclick = () => f.contentWindow.location.reload();
  addEventListener('resize', apply); apply();
  const clock = document.getElementById('clock');
  const tick = () => { const d = new Date(); clock.textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); };
  tick(); setInterval(tick, 15000);
  // Status bar colour = background at the top of the page (first non-transparent one under the top edge)
  const sb = document.getElementById('sb');
  function tint() {
    try {
      const doc = f.contentDocument; let el = doc.elementFromPoint(20, 1), bg = '';
      while (el) { const c = getComputedStyle(el).backgroundColor;
        if (c && c !== 'transparent' && !/rgba\(.*, 0\)$/.test(c)) { bg = c; break; } el = el.parentElement; }
      if (!bg) bg = 'rgb(255, 255, 255)';
      const [r, g, b] = bg.match(/[\d.]+/g).map(Number);
      sb.style.background = `rgb(${r}, ${g}, ${b})`;
      sb.style.color = (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#000' : '#fff';
    } catch (e) {}
  }
  // Outside scrollbar: mirrors the page's scroll; drag the thumb, click the track or use the wheel on it
  const ext = document.getElementById('ext'), thumb = document.getElementById('thumb');
  const se = () => f.contentDocument && f.contentDocument.scrollingElement;
  function sync() {
    const el = se(); if (!el) return;
    ext.style.height = document.getElementById('phone').clientHeight + 'px';
    const H = ext.clientHeight, ratio = el.clientHeight / el.scrollHeight;
    const th = Math.max(28, H * ratio), max = el.scrollHeight - el.clientHeight;
    thumb.style.height = th + 'px';
    thumb.style.transform = 'translateY(' + (max > 0 ? (H - th) * el.scrollTop / max : 0) + 'px)';
    ext.style.visibility = ratio >= 1 ? 'hidden' : 'visible';
  }
  function scrollToY(y, grab) {   // y: pointer position in the track; grab: where on the thumb it was taken
    const el = se(); if (!el) return;
    const H = ext.clientHeight, th = thumb.offsetHeight, max = el.scrollHeight - el.clientHeight;
    el.scrollTop = Math.min(1, Math.max(0, (y - grab) / (H - th))) * max;
  }
  ext.addEventListener('pointerdown', (e) => {
    const r = ext.getBoundingClientRect(), y = e.clientY - r.top;
    const top = thumb.getBoundingClientRect().top - r.top, th = thumb.offsetHeight;
    const grab = (y >= top && y <= top + th) ? y - top : th / 2;
    if (grab === th / 2) scrollToY(y, grab);
    ext.setPointerCapture(e.pointerId); ext.classList.add('drag');
    const move = (ev) => scrollToY(ev.clientY - r.top, grab);
    const up = () => { ext.classList.remove('drag'); ext.removeEventListener('pointermove', move); ext.removeEventListener('pointerup', up); };
    ext.addEventListener('pointermove', move); ext.addEventListener('pointerup', up);
    e.preventDefault();
  });
  ext.addEventListener('wheel', (e) => { const el = se(); if (el) { el.scrollTop += e.deltaY; e.preventDefault(); } }, { passive: false });
  addEventListener('resize', sync);
  f.addEventListener('load', () => {
    try {
      const st = f.contentDocument.createElement('style');
      st.textContent = 'html { scrollbar-width: none; } html::-webkit-scrollbar { display: none; }';
      f.contentDocument.head.appendChild(st);
    } catch (e) {}
    tint(); sync(); let t = 0;
    f.contentWindow.addEventListener('scroll', () => { sync(); if (!t) t = setTimeout(() => { t = 0; tint(); }, 120); }, { passive: true });
    f.contentWindow.addEventListener('resize', sync);
    new ResizeObserver(sync).observe(f.contentDocument.documentElement);   // the page grows as images and sections load
  });
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
