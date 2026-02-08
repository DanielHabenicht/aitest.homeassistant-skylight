# Quickstart Guide

## For Home Assistant Users

1. **Add Repository**:
   - Go to Supervisor → Add-on Store
   - Click the menu (⋮) → Repositories
   - Add: `https://github.com/DanielHabenicht/aitest.homeassistant-skylight`

2. **Install Add-On**:
   - Find "Skylight Calendar" in the store
   - Click Install
   - Wait for installation to complete

3. **Configure**:
   - Adjust settings as needed (defaults work for most users)
   - Enable "Start on boot" if desired

4. **Start**:
   - Click Start
   - Wait for the add-on to start
   - Click "Open Web UI" or access via panel

## For Developers

### Quick Test Setup

```bash
# Clone repository
git clone https://github.com/DanielHabenicht/aitest.homeassistant-skylight
cd aitest.homeassistant-skylight

# Option 1: Docker Compose (includes Home Assistant)
docker-compose up -d

# Option 2: Standalone testing
cd rootfs/app
pip3 install -r ../../requirements.txt
export SUPERVISOR_TOKEN="test_token"
export HASS_URL="http://localhost:8123"
python3 server.py

# Access at http://localhost:8099
```

### Run Tests

```bash
cd rootfs/app
pip3 install -r ../../requirements.txt
pytest tests/
```

## First Steps

1. **Set up calendar integration** in Home Assistant:
   - Go to Settings → Devices & Services
   - Add a calendar integration (e.g., Google Calendar, CalDAV)

2. **Create person entities** (optional):
   - Go to Settings → People
   - Add family members

3. **Add todo lists** (optional):
   - Add a todo integration
   - Create lists for different purposes

4. **Access Skylight Calendar**:
   - Open the add-on web UI
   - Switch between Day, Week, and Month views
   - Create your first event!

## Common Tasks

### Creating an Event
1. Click "+ Add Event"
2. Fill in title, calendar, start/end times
3. Click "Create Event"

### Adding a Todo
1. Click "+ Add Todo" in the sidebar
2. Select a todo list
3. Enter the todo item
4. Click "Add Todo"

### Filtering by Person
1. Use the "Filter by Person" dropdown
2. Select a family member
3. View only their events

## Troubleshooting

**Calendar not showing events?**
- Verify calendar integration is working in Home Assistant
- Check the date range (navigate to the correct month)
- Review add-on logs

**Can't create events?**
- Ensure calendar supports event creation
- Check Home Assistant permissions
- Review add-on logs for errors

**Todo list not showing?**
- Verify todo integration is configured
- Check that todo entities exist in Home Assistant
- Reload the add-on

## Getting Help

- Check the [README.md](README.md) for detailed documentation
- Review [Issues](https://github.com/DanielHabenicht/aitest.homeassistant-skylight/issues)
- Ask in Home Assistant Community Forum
