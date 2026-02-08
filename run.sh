#!/usr/bin/with-contenv bashio

export SUPERVISOR_TOKEN="${SUPERVISOR_TOKEN}"
export HASS_URL="http://supervisor/core"

bashio::log.info "Starting Skylight Calendar Add-On..."

cd /app
python3 /app/server.py
