# Screenshots

## Main Calendar View (Month View)

The main calendar interface showing:
- Month view with calendar grid
- Navigation controls (Previous, Today, Next)
- View selector (Day, Week, Month)
- Person and calendar filters
- "+ Add Event" button
- Todo list sidebar

![Month View](screenshots/month-view.png)

## Week View

Seven-day overview:
- Week view with all 7 days visible
- Events displayed per day
- Easy navigation between weeks

![Week View](screenshots/week-view.png)

## Day View

Detailed hourly breakdown:
- 24-hour timeline
- Events shown in their time slots
- Perfect for daily planning

![Day View](screenshots/day-view.png)

## Add Event Modal

Event creation interface:
- Simple, intuitive form
- Calendar selection
- Date/time pickers
- Description field

![Add Event Modal](screenshots/add-event-modal.png)

## Todo List Integration

Todo list sidebar showing:
- Multiple todo lists
- Add/complete/delete functionality
- Real-time sync with Home Assistant

![Todo List](screenshots/todo-list.png)

## Person Filter

Filter calendar by person:
- Dropdown to select family member
- Show only their events
- Quick toggle between views

![Person Filter](screenshots/person-filter.png)

---

**Note**: To generate actual screenshots, run the add-on and use your browser's screenshot tool, or use automated screenshot tools like Playwright or Puppeteer.

## Taking Screenshots

### Using Browser DevTools

1. Start the add-on
2. Open http://localhost:8099 in Chrome/Firefox
3. Press F12 to open DevTools
4. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)
5. Type "screenshot" and select "Capture full size screenshot"

### Using Playwright (Automated)

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:8099')
    page.screenshot(path='month-view.png', full_page=True)
    browser.close()
```
