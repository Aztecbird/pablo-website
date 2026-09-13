#!/bin/bash
# ==============================================================================
# Microcosm AI — Adaptive Performance Companion Launcher
# Pablo Arellano | https://www.pabloarellano.org
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "======================================================="
echo "   Microcosm AI — Adaptive Performance Companion       "
echo "   Pablo Arellano • v1.2.0 Production                  "
echo "======================================================="

# Free port 3880 if already occupied
EXISTING_PID=$(lsof -ti :3880 2>/dev/null)
if [ -n "$EXISTING_PID" ]; then
    echo "[*] Freeing existing process on port 3880 (PID: $EXISTING_PID)..."
    kill -9 $EXISTING_PID 2>/dev/null
    sleep 0.5
fi

# Launch Web UI in default browser
echo "[*] Opening browser at http://localhost:3880 ..."
(sleep 1.2 && open "http://localhost:3880") &

# Start Node engine & CoreMIDI bridge daemon
echo "[*] Starting CoreMIDI Engine and WebSocket Server..."
if [ -x "/usr/local/bin/node" ]; then
    /usr/local/bin/node server.js
elif [ -x "/opt/homebrew/bin/node" ]; then
    /opt/homebrew/bin/node server.js
else
    node server.js
fi
