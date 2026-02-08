#!/bin/bash
set -e

echo "Starting Skylight Calendar Add-On..."

# Check if running in Home Assistant
if [ -z "$SUPERVISOR_TOKEN" ]; then
    echo "Warning: SUPERVISOR_TOKEN not set. Running in standalone mode."
    export SUPERVISOR_TOKEN="dev_token"
fi

if [ -z "$HASS_URL" ]; then
    echo "Warning: HASS_URL not set. Using default."
    export HASS_URL="http://supervisor/core"
fi

# Start the server
cd /app
exec python3 /app/server.py
