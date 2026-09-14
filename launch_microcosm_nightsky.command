#!/bin/bash
# ==============================================================================
# Microcosm + NightSky Dual Pedal Station Launcher (v1.3.0)
# Pablo Arellano | https://www.pabloarellano.org
# ==============================================================================

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "================================================================"
echo "   Microcosm + NightSky — Dual Pedal Performance Station        "
echo "   Pablo Arellano • v1.3.0 Production Live                      "
echo "================================================================"

# Free port 3880 if already in use
EXISTING_PID=$(lsof -ti :3880 2>/dev/null)
if [ -n "$EXISTING_PID" ]; then
    echo "[*] Freeing existing server on port 3880 (PID: $EXISTING_PID)..."
    kill -9 $EXISTING_PID 2>/dev/null
    sleep 0.5
fi

# Open default browser to UI
echo "[*] Opening browser at http://localhost:3880 ..."
(sleep 1.2 && open "http://localhost:3880") &

# Run Node engine & CoreMIDI daemon
echo "[*] Launching Dual MIDI Engine (Microcosm Ch1 + NightSky Ch2)..."
if [ -x "/usr/local/bin/node" ]; then
    /usr/local/bin/node server.js
elif [ -x "/opt/homebrew/bin/node" ]; then
    /opt/homebrew/bin/node server.js
else
    node server.js
fi
