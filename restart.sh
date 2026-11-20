#!/bin/bash
# PIVOT Automation Suite - Restart Script

echo "Stopping any running PIVOT server..."
pkill -f "node server.js" 2>/dev/null || true
sleep 1

echo "Starting PIVOT Automation Suite..."
cd "$(dirname "$0")"
node server.js &

echo ""
echo "PIVOT server started on http://localhost:3000"
echo "You can close this terminal window - the server will keep running."
