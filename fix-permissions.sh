#!/bin/bash

# Fix LuckyLens Permission Issues
# This script fixes permission problems caused by running npm with sudo

echo "Fixing file permissions..."

# Remove the problematic .next directory
rm -rf .next

# Fix ownership of all files in the project
chown -R syebrex:syebrex /home/syebrex/.openclaw/workspace/luckylens

echo "✓ Permissions fixed!"
echo ""
echo "Now run: ./quickstart.sh"
