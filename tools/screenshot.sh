#!/bin/sh
# Screenshot this site with headless Chrome, to check a layout without looking at a screen.
#   sh tools/screenshot.sh PAGE WIDTH HEIGHT OUT.png [TARGET] [--mobile]
#   e.g.  sh tools/screenshot.sh "" 1440 900 /tmp/x.png integrations
#         sh tools/screenshot.sh product 390 844 /tmp/y.png full --mobile
# Details of each argument: tools/screenshot.py. Serves the working copy on 127.0.0.1:8765 (started if not
# already running), so unpushed changes are included; Chrome only ever opens that local address.
set -e
cd "$(dirname "$0")/.."
PORT=8765
if ! curl -s -o /dev/null "http://127.0.0.1:$PORT/"; then
  nohup python3 -I tools/serve.py "$PORT" >/dev/null 2>&1 &
  sleep 1
fi
SHOT_PORT=$PORT exec python3 -I tools/screenshot.py "$@"
