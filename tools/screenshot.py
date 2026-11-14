"""Screenshot this site with headless Chrome (run through tools/screenshot.sh).

    sh tools/screenshot.sh PAGE WIDTH HEIGHT OUT.png [TARGET] [--mobile]

PAGE    path after the site root: "" (home), "product", "pricing", "contact#%"
WIDTH HEIGHT    window size in CSS pixels: 1440 900 (desktop), 390 844 (phone)
OUT     PNG to write
TARGET  what to capture: "view" (the window as it first opens, default), "full" (whole page),
        or a section id such as "integrations" or "cta" (that section only)
--mobile    phone emulation (touch, mobile viewport) on top of the size

Only opens the local copy served on 127.0.0.1 by screenshot.sh, so unpushed changes are included.
Elements that normally fade in while scrolling (.reveal) are shown at once, as a reader would see them.
"""
import asyncio, base64, json, os, re, shutil, subprocess, sys, tempfile, time, urllib.request

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def args():
    a = [x for x in sys.argv[1:] if x != "--mobile"]
    mobile = "--mobile" in sys.argv[1:]
    if len(a) < 4:
        sys.exit(__doc__)
    page, w, h, out = a[0], int(a[1]), int(a[2]), a[3]
    target = a[4] if len(a) > 4 else "view"
    if "://" in page or ".." in page or page.startswith("/"):
        sys.exit("PAGE must be a path inside the site")
    if not out.endswith(".png"):
        sys.exit("OUT must end in .png")
    if not re.fullmatch(r"view|full|[A-Za-z][\w-]*", target):
        sys.exit("TARGET must be view, full or a section id")
    return page, w, h, out, target, mobile


async def run(port, page, w, h, out, target, mobile, devtools):
    import websockets
    tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{devtools}/json"))
    ws_url = next(t for t in tabs if t["type"] == "page")["webSocketDebuggerUrl"]
    async with websockets.connect(ws_url, max_size=200_000_000) as ws:
        seq = 0

        async def cmd(method, params=None):
            nonlocal seq
            seq += 1
            me = seq
            await ws.send(json.dumps({"id": me, "method": method, "params": params or {}}))
            while True:
                msg = json.loads(await ws.recv())
                if msg.get("id") == me:
                    if "error" in msg:
                        raise RuntimeError(f"{method}: {msg['error']}")
                    return msg.get("result", {})

        async def js(expr):
            r = await cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
            return r.get("result", {}).get("value")

        await cmd("Page.enable")
        await cmd("Emulation.setDeviceMetricsOverride",
                  {"width": w, "height": h, "deviceScaleFactor": 2 if mobile else 1, "mobile": mobile})
        if mobile:
            await cmd("Emulation.setTouchEmulationEnabled", {"enabled": True, "maxTouchPoints": 5})
        await cmd("Page.navigate", {"url": f"http://127.0.0.1:{port}/{page}"})
        for _ in range(100):                       # wait for load
            await asyncio.sleep(0.1)
            if await js("document.readyState") == "complete":
                break
        await asyncio.sleep(1.2)                   # fonts, first animation frames
        await js("document.querySelectorAll('.reveal').forEach(e => e.classList.add('visible'))")
        await asyncio.sleep(0.9)                   # let the fade-ins finish

        shot = {"format": "png", "captureBeyondViewport": True}
        if target == "full":
            height = await js("document.documentElement.scrollHeight")
            shot["clip"] = {"x": 0, "y": 0, "width": w, "height": height, "scale": 1}
        elif target != "view":
            box = await js(f"""(() => {{ const e = document.getElementById({json.dumps(target)});
                if (!e) return null; const r = e.getBoundingClientRect();
                return [r.top + scrollY, r.height]; }})()""")
            if not box:
                sys.exit(f"no element with id '{target}' on that page")
            shot["clip"] = {"x": 0, "y": box[0], "width": w, "height": box[1], "scale": 1}
        data = (await cmd("Page.captureScreenshot", shot))["data"]
        with open(out, "wb") as f:
            f.write(base64.b64decode(data))


def main():
    page, w, h, out, target, mobile = args()
    port = int(os.environ.get("SHOT_PORT", "8765"))
    profile = tempfile.mkdtemp()
    chrome = subprocess.Popen([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
                               "--no-default-browser-check", f"--user-data-dir={profile}",
                               "--remote-debugging-address=127.0.0.1", "--remote-debugging-port=0",
                               f"--window-size={w},{h}", "about:blank"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        portfile = os.path.join(profile, "DevToolsActivePort")
        for _ in range(100):
            if os.path.exists(portfile) and open(portfile).read().strip():
                break
            time.sleep(0.1)
        devtools = int(open(portfile).read().split()[0])
        asyncio.run(run(port, page, w, h, out, target, mobile, devtools))
        print(out)
    finally:
        chrome.terminate()
        try:
            chrome.wait(5)
        except subprocess.TimeoutExpired:
            chrome.kill()
        shutil.rmtree(profile, ignore_errors=True)


if __name__ == "__main__":
    main()
