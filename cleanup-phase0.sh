#!/bin/bash
# Phase 0 Cleanup - Run this once from Terminal, then delete this script
# Usage: bash cleanup-phase0.sh

cd /Users/vijaykumarkp/pivot-proxy/PIVOT-Automation-Suite

echo "Removing dead code and backup files..."
rm -f test.txt
rm -f server.js.bak server.js.bak2 server.js.bak4
rm -f fix-endorsements.mjs
rm -f pivot-proxy-backup.tar.gz
rm -f BACKUP-INFO.md
rm -f .DS_Store
rm -f public/app.js
rm -f public/test-component.js
rm -f public/app-new.js.bak public/app-new.js.bak2 public/app-new.js.bak4
rm -f public/app-new.js.backup public/app-new.js.backup-before-endorsement-fix
rm -f public/index.html.bak public/index.html.bak2
rm -f .git/index.lock

echo "Cleanup complete! Verifying..."
echo ""
echo "=== Remaining files ==="
ls -la
echo ""
echo "=== public/ ==="
ls -la public/
echo ""
echo "=== Git status ==="
git status
echo ""
echo "You can now delete this script: rm cleanup-phase0.sh"
