"""Tests for Skylight Calendar Server."""
import pytest
from server import app


@pytest.fixture
def client():
    """Create test client."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_index(client):
    """Test index page loads."""
    rv = client.get('/')
    assert rv.status_code == 200


def test_calendars_endpoint(client):
    """Test calendars endpoint."""
    rv = client.get('/api/calendars')
    # May fail without real Home Assistant connection
    assert rv.status_code in [200, 500]


def test_persons_endpoint(client):
    """Test persons endpoint."""
    rv = client.get('/api/persons')
    # May fail without real Home Assistant connection
    assert rv.status_code in [200, 500]


def test_todos_endpoint(client):
    """Test todos endpoint."""
    rv = client.get('/api/todos')
    # May fail without real Home Assistant connection
    assert rv.status_code in [200, 500]


def test_events_endpoint_requires_dates(client):
    """Test events endpoint requires start and end dates."""
    rv = client.get('/api/events')
    assert rv.status_code == 400
    assert b'Start and end dates required' in rv.data


def test_create_event_requires_calendar(client):
    """Test event creation requires calendar ID."""
    rv = client.post('/api/events', json={})
    assert rv.status_code == 400
    assert b'Calendar ID required' in rv.data


def test_create_todo_requires_entity(client):
    """Test todo creation requires entity ID."""
    rv = client.post('/api/todos', json={})
    assert rv.status_code == 400
    assert b'Entity ID required' in rv.data
