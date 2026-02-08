#!/usr/bin/env python3
"""Skylight Calendar Add-On Server."""
import os
import json
import logging
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# Home Assistant configuration
SUPERVISOR_TOKEN = os.environ.get('SUPERVISOR_TOKEN', '')
HASS_URL = os.environ.get('HASS_URL', 'http://supervisor/core')
HEADERS = {
    'Authorization': f'Bearer {SUPERVISOR_TOKEN}',
    'Content-Type': 'application/json',
}


def get_hass_api(endpoint):
    """Make a GET request to Home Assistant API."""
    try:
        url = f"{HASS_URL}/api/{endpoint}"
        logger.info(f"GET request to: {url}")
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Error calling Home Assistant API: {e}")
        return None


def post_hass_api(endpoint, data):
    """Make a POST request to Home Assistant API."""
    try:
        url = f"{HASS_URL}/api/{endpoint}"
        logger.info(f"POST request to: {url}")
        response = requests.post(url, headers=HEADERS, json=data, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Error calling Home Assistant API: {e}")
        return None


@app.route('/')
def index():
    """Serve the main page."""
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/calendars')
def get_calendars():
    """Get all calendar entities from Home Assistant."""
    states = get_hass_api('states')
    if not states:
        return jsonify({'error': 'Failed to fetch calendars'}), 500
    
    calendars = [
        {
            'entity_id': state['entity_id'],
            'name': state['attributes'].get('friendly_name', state['entity_id']),
            'color': state['attributes'].get('color', '#4285f4'),
        }
        for state in states
        if state['entity_id'].startswith('calendar.')
    ]
    
    return jsonify(calendars)


@app.route('/api/persons')
def get_persons():
    """Get all person entities from Home Assistant."""
    states = get_hass_api('states')
    if not states:
        return jsonify({'error': 'Failed to fetch persons'}), 500
    
    persons = [
        {
            'entity_id': state['entity_id'],
            'name': state['attributes'].get('friendly_name', state['entity_id']),
            'id': state['attributes'].get('id', state['entity_id'].replace('person.', '')),
        }
        for state in states
        if state['entity_id'].startswith('person.')
    ]
    
    return jsonify(persons)


@app.route('/api/events')
def get_events():
    """Get calendar events from Home Assistant."""
    start = request.args.get('start', '')
    end = request.args.get('end', '')
    calendar_id = request.args.get('calendar_id', None)
    
    if not start or not end:
        return jsonify({'error': 'Start and end dates required'}), 400
    
    # Get all calendar entities
    states = get_hass_api('states')
    if not states:
        return jsonify({'error': 'Failed to fetch calendars'}), 500
    
    calendar_entities = [
        state['entity_id']
        for state in states
        if state['entity_id'].startswith('calendar.')
    ]
    
    # Filter to specific calendar if requested
    if calendar_id:
        calendar_entities = [calendar_id] if calendar_id in calendar_entities else []
    
    all_events = []
    for calendar_entity in calendar_entities:
        # Get events for this calendar
        endpoint = f"calendars/{calendar_entity}?start={start}&end={end}"
        events = get_hass_api(endpoint)
        
        if events:
            for event in events:
                event['calendar_id'] = calendar_entity
                all_events.append(event)
    
    return jsonify(all_events)


@app.route('/api/events', methods=['POST'])
def create_event():
    """Create a new calendar event."""
    data = request.json
    
    if not data or not data.get('calendar_id'):
        return jsonify({'error': 'Calendar ID required'}), 400
    
    calendar_id = data['calendar_id']
    
    # Call Home Assistant service to create event
    service_data = {
        'entity_id': calendar_id,
        'summary': data.get('summary', 'New Event'),
        'start': data.get('start'),
        'end': data.get('end'),
        'description': data.get('description', ''),
    }
    
    result = post_hass_api('services/calendar/create_event', service_data)
    
    if result:
        return jsonify({'success': True, 'result': result})
    else:
        return jsonify({'error': 'Failed to create event'}), 500


@app.route('/api/todos')
def get_todos():
    """Get todo items from Home Assistant."""
    states = get_hass_api('states')
    if not states:
        return jsonify({'error': 'Failed to fetch todos'}), 500
    
    todos = []
    for state in states:
        if state['entity_id'].startswith('todo.'):
            # Get the todo list items
            todos.append({
                'entity_id': state['entity_id'],
                'name': state['attributes'].get('friendly_name', state['entity_id']),
                'items': state['attributes'].get('items', []),
            })
    
    return jsonify(todos)


@app.route('/api/todos', methods=['POST'])
def create_todo():
    """Create a new todo item."""
    data = request.json
    
    if not data or not data.get('entity_id'):
        return jsonify({'error': 'Entity ID required'}), 400
    
    service_data = {
        'entity_id': data['entity_id'],
        'item': data.get('item', 'New Todo'),
    }
    
    result = post_hass_api('services/todo/add_item', service_data)
    
    if result:
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Failed to create todo'}), 500


@app.route('/api/todos/<entity_id>/<item_id>', methods=['PUT'])
def update_todo(entity_id, item_id):
    """Update a todo item."""
    data = request.json
    
    service_data = {
        'entity_id': f'todo.{entity_id}',
        'item': item_id,
        'status': data.get('status', 'needs_action'),
    }
    
    result = post_hass_api('services/todo/update_item', service_data)
    
    if result:
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Failed to update todo'}), 500


@app.route('/api/todos/<entity_id>/<item_id>', methods=['DELETE'])
def delete_todo(entity_id, item_id):
    """Delete a todo item."""
    service_data = {
        'entity_id': f'todo.{entity_id}',
        'item': item_id,
    }
    
    result = post_hass_api('services/todo/remove_item', service_data)
    
    if result:
        return jsonify({'success': True})
    else:
        return jsonify({'error': 'Failed to delete todo'}), 500


if __name__ == '__main__':
    logger.info("Starting Skylight Calendar server on port 8099")
    app.run(host='0.0.0.0', port=8099, debug=False)
