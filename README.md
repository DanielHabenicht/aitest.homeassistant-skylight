# Skylight Calendar Add-On for Home Assistant

A comprehensive family calendar add-on for Home Assistant that integrates with calendar entities and provides an intuitive interface for managing events and todos.

## Features

### 📅 Calendar Views
- **Day View**: Hourly breakdown of events for a single day
- **Week View**: 7-day overview with all events
- **Month View**: Traditional monthly calendar grid

### 👥 Person-Scoped Filtering
- Filter calendar events by person entities in Home Assistant
- View family members' schedules individually or combined
- Easy toggle between personal and family views

### ✨ Event Management
- Quick event creation with intuitive modal interface
- Integration with Home Assistant calendar entities
- Support for multiple calendars with color coding
- Event details including title, start/end time, and description

### ✅ Todo List Integration
- Full integration with Home Assistant todo entities
- Add, complete, and delete todo items
- Multiple todo lists support
- Real-time synchronization with Home Assistant

## Installation

### Option 1: Home Assistant Add-On Store (Recommended)

1. Navigate to **Supervisor** → **Add-on Store**
2. Click the menu (⋮) in the top right
3. Select **Repositories**
4. Add this repository URL: `https://github.com/DanielHabenicht/aitest.homeassistant-skylight`
5. Find "Skylight Calendar" in the add-on store
6. Click **Install**
7. Enable **Start on boot** and **Auto update**
8. Click **Start**

### Option 2: Manual Installation

1. Clone this repository to your Home Assistant add-ons directory:
   ```bash
   cd /addons
   git clone https://github.com/DanielHabenicht/aitest.homeassistant-skylight skylight_calendar
   ```

2. Restart Home Assistant or reload add-ons

3. Navigate to **Supervisor** → **Add-on Store** → **Local Add-ons**

4. Install the "Skylight Calendar" add-on

## Configuration

The add-on provides several configuration options:

```yaml
default_view: "month"      # Default calendar view: day, week, or month
show_week_numbers: true    # Display week numbers in calendar
first_day_of_week: 1       # 0 = Sunday, 1 = Monday, etc.
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `default_view` | list | `month` | Default calendar view (day/week/month) |
| `show_week_numbers` | bool | `true` | Show week numbers in calendar views |
| `first_day_of_week` | int | `1` | First day of week (0=Sunday, 6=Saturday) |

## Usage

### Accessing the Calendar

After installation, access the calendar through:
- **Web UI**: Click the add-on panel or navigate to `http://homeassistant.local:8099`
- **Ingress**: The add-on supports Home Assistant ingress for seamless integration

### Creating Events

1. Click the **+ Add Event** button in the header
2. Fill in event details:
   - Title (required)
   - Calendar selection (required)
   - Start date/time (required)
   - End date/time (required)
   - Description (optional)
3. Click **Create Event**

### Managing Todos

1. Click the **+ Add Todo** button in the todo section
2. Select the todo list
3. Enter the todo item text
4. Click **Add Todo**

To complete or delete todos:
- Click the checkbox to mark as complete
- Click the **×** button to delete

### Filtering Views

- **By Person**: Use the person dropdown to filter events for specific family members
- **By Calendar**: Use the calendar dropdown to show events from specific calendars
- **Navigation**: Use Previous/Next buttons or click **Today** to jump to current date

## Requirements

- Home Assistant OS, Supervised, or Container installation
- At least one calendar integration configured in Home Assistant
- (Optional) Person entities for person-scoped filtering
- (Optional) Todo integrations for todo list functionality

## Compatible Calendar Integrations

This add-on works with any Home Assistant calendar integration, including:
- Google Calendar
- CalDAV
- Local Calendar
- Office 365
- Apple iCloud
- And more...

## Compatible Todo Integrations

- Local Todo
- CalDAV Todo Lists
- Todoist
- Google Tasks
- And more...

## Development & Testing

### Local Development Setup

1. **Prerequisites**:
   ```bash
   # Install Docker
   # Install Home Assistant development environment
   ```

2. **Clone and Build**:
   ```bash
   git clone https://github.com/DanielHabenicht/aitest.homeassistant-skylight
   cd aitest.homeassistant-skylight
   docker build -t skylight-calendar .
   ```

3. **Run Locally** (for testing without Home Assistant):
   ```bash
   cd rootfs/app
   export SUPERVISOR_TOKEN="test_token"
   export HASS_URL="http://localhost:8123"
   python3 server.py
   ```

4. **Access the UI**:
   - Open browser to `http://localhost:8099`

### Testing with Home Assistant

1. **Install as local add-on** (see manual installation above)

2. **Configure test calendars**:
   - Add test calendar entities in Home Assistant
   - Create test person entities
   - Add test todo lists

3. **Test features**:
   - Create events through the UI
   - Switch between day/week/month views
   - Filter by person and calendar
   - Add and manage todos
   - Verify synchronization with Home Assistant

### Running Tests

```bash
# Install test dependencies
pip3 install pytest pytest-flask

# Run backend tests
cd rootfs/app
pytest tests/

# Run linting
flake8 server.py
```

## Troubleshooting

### Calendar Events Not Showing

1. Verify calendar integrations are properly configured
2. Check that calendar entities exist in Home Assistant
3. Review add-on logs for API errors
4. Ensure date range covers your events

### Todo Items Not Appearing

1. Verify todo integrations are configured
2. Check that todo entities exist and are accessible
3. Review add-on logs for connection issues

### Connection Issues

1. Check that Home Assistant is running
2. Verify the add-on has proper permissions
3. Review supervisor logs
4. Restart the add-on

### View Logs

```bash
# From Home Assistant UI
Supervisor → Skylight Calendar → Logs

# Or via CLI
docker logs addon_skylight_calendar
```

## Architecture

### Backend (Python/Flask)
- RESTful API server
- Home Assistant integration via Supervisor API
- Calendar and todo entity management
- Event creation and management

### Frontend (HTML/CSS/JavaScript)
- Responsive single-page application
- Modern, clean UI design
- Real-time updates
- Mobile-friendly interface

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/DanielHabenicht/aitest.homeassistant-skylight/issues)
- **Discussions**: [GitHub Discussions](https://github.com/DanielHabenicht/aitest.homeassistant-skylight/discussions)
- **Home Assistant Community**: [Community Forum](https://community.home-assistant.io/)

## Roadmap

Future enhancements planned:
- [ ] Event editing and deletion
- [ ] Recurring events support
- [ ] Event reminders
- [ ] Calendar export/import
- [ ] Dark mode theme
- [ ] Customizable color schemes
- [ ] Mobile app integration
- [ ] Multiple language support

## Credits

Inspired by modern calendar applications and built specifically for Home Assistant integration.

---

**Note**: This add-on requires a working Home Assistant installation with the Supervisor component.