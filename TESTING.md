# Skylight Calendar Demo & Testing Guide

This guide helps you test the Skylight Calendar add-on locally.

## Quick Start with Docker Compose

The easiest way to test the add-on is using Docker Compose, which sets up both Home Assistant and the Skylight Calendar add-on.

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DanielHabenicht/aitest.homeassistant-skylight
   cd aitest.homeassistant-skylight
   ```

2. **Start the services**:
   ```bash
   docker-compose up -d
   ```
   
   This starts:
   - Home Assistant on port 8123
   - Skylight Calendar on port 8099

3. **Access Home Assistant**:
   - Open http://localhost:8123
   - Complete the onboarding wizard
   - Create an account

4. **Set up demo data**:
   
   a. **Add a calendar**:
   - Go to Settings → Devices & Services
   - Click "+ Add Integration"
   - Search for "Local Calendar"
   - Add a calendar (e.g., "Family Calendar")

   b. **Create person entities** (already configured in test-config):
   - Go to Settings → People
   - Persons are pre-configured: John Doe, Jane Doe

   c. **Add todo lists**:
   - Go to Settings → Devices & Services
   - Click "+ Add Integration"
   - Search for "Local To-do"
   - Add a list (e.g., "Shopping List")

5. **Access Skylight Calendar**:
   - Open http://localhost:8099
   - You should see the calendar interface!

6. **Test the features**:
   - Switch between Day, Week, and Month views
   - Create a new event using "+ Add Event"
   - Filter by person using the dropdown
   - Add todo items using "+ Add Todo"

## Manual Testing (Without Docker)

If you prefer to test without Docker:

### 1. Install Dependencies

```bash
cd rootfs/app
pip3 install -r ../../requirements.txt
```

### 2. Set Environment Variables

```bash
export SUPERVISOR_TOKEN="your_home_assistant_token"
export HASS_URL="http://localhost:8123"
```

To get a Home Assistant token:
1. Go to your Home Assistant profile
2. Scroll to "Long-Lived Access Tokens"
3. Click "Create Token"
4. Copy the token

### 3. Run the Server

```bash
python3 server.py
```

### 4. Access the UI

Open http://localhost:8099 in your browser.

## Running Tests

```bash
cd rootfs/app
pip3 install pytest pytest-flask
pytest tests/ -v
```

Expected output:
```
tests/test_server.py::test_index PASSED
tests/test_server.py::test_calendars_endpoint PASSED
tests/test_server.py::test_persons_endpoint PASSED
tests/test_server.py::test_todos_endpoint PASSED
tests/test_server.py::test_events_endpoint_requires_dates PASSED
tests/test_server.py::test_create_event_requires_calendar PASSED
tests/test_server.py::test_create_todo_requires_entity PASSED
```

## Testing Scenarios

### Scenario 1: Create a Family Event

1. Open Skylight Calendar
2. Click "+ Add Event"
3. Fill in:
   - Title: "Family Dinner"
   - Calendar: "Family Calendar"
   - Start: Today at 6:00 PM
   - End: Today at 8:00 PM
   - Description: "Weekly family dinner"
4. Click "Create Event"
5. Verify the event appears in the calendar

### Scenario 2: Filter by Person

1. Create events for different family members
2. Use the "Filter by Person" dropdown
3. Select "John Doe"
4. Verify only John's events are shown
5. Select "All People" to see all events

### Scenario 3: Switch Calendar Views

1. Start in Month view (default)
2. Click "Week" to see the week view
3. Click "Day" to see today's schedule by hour
4. Use Previous/Next buttons to navigate
5. Click "Today" to return to current date

### Scenario 4: Manage Todo Lists

1. Click "+ Add Todo"
2. Select a todo list
3. Enter "Buy groceries"
4. Click "Add Todo"
5. Click the checkbox to mark complete
6. Click × to delete the item

## Troubleshooting

### Can't connect to Home Assistant

**Error**: Connection refused or timeout

**Solution**:
- Ensure Home Assistant is running
- Check the HASS_URL environment variable
- Verify the SUPERVISOR_TOKEN is correct
- Check firewall settings

### No calendars showing

**Solution**:
- Add a calendar integration in Home Assistant
- Restart the Skylight Calendar service
- Check Home Assistant logs

### Events not appearing

**Solution**:
- Verify the calendar has events in the date range
- Check the calendar filter isn't hiding events
- Navigate to the correct date
- Refresh the page

### Docker Compose issues

**Solution**:
```bash
# Stop and remove containers
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f skylight
```

## Clean Up

To stop and remove all containers:

```bash
docker-compose down
```

To also remove volumes (resets Home Assistant):

```bash
docker-compose down -v
```

## Next Steps

Once you've tested locally:

1. Install as a Home Assistant add-on (see README.md)
2. Configure for your family's needs
3. Add real calendar integrations (Google Calendar, CalDAV, etc.)
4. Set up automations based on calendar events
5. Customize the configuration options

## Getting Help

- Review the [README.md](README.md) for detailed documentation
- Check [QUICKSTART.md](QUICKSTART.md) for quick start guide
- Report issues on GitHub
- Ask questions in the Home Assistant community
