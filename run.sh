#!/usr/bin/env bash
cd "$(dirname "$0")"
which python3 >/dev/null 2>&1 && PY=python3 || PY=python
which $PY >/dev/null 2>&1 || { echo "Python not found"; xdz-open index.html 2>/dev/null || open index.html 2>/dev/null; exit 0; }
$PY -m http.server 8080 &
PID=$!
sleep 1
open http://localhost:8080 2>/dev/null || xdg-open http://localhost:8080 2>/dev/null
wait $PID
