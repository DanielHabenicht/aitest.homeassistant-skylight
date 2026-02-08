// Skylight Calendar Application
class SkylightCalendar {
    constructor() {
        this.currentView = 'month';
        this.currentDate = new Date();
        this.calendars = [];
        this.persons = [];
        this.events = [];
        this.todos = [];
        this.selectedPerson = '';
        this.selectedCalendar = '';
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.loadCalendars();
        await this.loadPersons();
        await this.loadTodos();
        this.renderCalendar();
    }
    
    setupEventListeners() {
        // View selector
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.renderCalendar();
            });
        });
        
        // Navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.navigate(-1));
        document.getElementById('nextBtn').addEventListener('click', () => this.navigate(1));
        document.getElementById('todayBtn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.renderCalendar();
        });
        
        // Filters
        document.getElementById('personFilter').addEventListener('change', (e) => {
            this.selectedPerson = e.target.value;
            this.renderCalendar();
        });
        
        document.getElementById('calendarFilter').addEventListener('change', (e) => {
            this.selectedCalendar = e.target.value;
            this.renderCalendar();
        });
        
        // Modals
        this.setupModalListeners();
    }
    
    setupModalListeners() {
        const eventModal = document.getElementById('eventModal');
        const todoModal = document.getElementById('todoModal');
        
        // Add Event Modal
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.showEventModal();
        });
        
        document.getElementById('cancelEventBtn').addEventListener('click', () => {
            eventModal.classList.remove('show');
        });
        
        eventModal.querySelector('.close').addEventListener('click', () => {
            eventModal.classList.remove('show');
        });
        
        document.getElementById('eventForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createEvent();
            eventModal.classList.remove('show');
        });
        
        // Add Todo Modal
        document.getElementById('addTodoBtn').addEventListener('click', () => {
            this.showTodoModal();
        });
        
        document.getElementById('cancelTodoBtn').addEventListener('click', () => {
            todoModal.classList.remove('show');
        });
        
        todoModal.querySelector('.close').addEventListener('click', () => {
            todoModal.classList.remove('show');
        });
        
        document.getElementById('todoForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createTodo();
            todoModal.classList.remove('show');
        });
        
        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === eventModal) {
                eventModal.classList.remove('show');
            }
            if (e.target === todoModal) {
                todoModal.classList.remove('show');
            }
        });
    }
    
    async loadCalendars() {
        try {
            const response = await fetch('/api/calendars');
            this.calendars = await response.json();
            this.populateCalendarFilters();
        } catch (error) {
            console.error('Error loading calendars:', error);
        }
    }
    
    async loadPersons() {
        try {
            const response = await fetch('/api/persons');
            this.persons = await response.json();
            this.populatePersonFilter();
        } catch (error) {
            console.error('Error loading persons:', error);
        }
    }
    
    async loadEvents() {
        const { start, end } = this.getDateRange();
        const params = new URLSearchParams({
            start: start.toISOString(),
            end: end.toISOString()
        });
        
        if (this.selectedCalendar) {
            params.append('calendar_id', this.selectedCalendar);
        }
        
        try {
            const response = await fetch(`/api/events?${params}`);
            this.events = await response.json();
        } catch (error) {
            console.error('Error loading events:', error);
            this.events = [];
        }
    }
    
    async loadTodos() {
        try {
            const response = await fetch('/api/todos');
            this.todos = await response.json();
            this.renderTodos();
        } catch (error) {
            console.error('Error loading todos:', error);
        }
    }
    
    populateCalendarFilters() {
        const calendarFilter = document.getElementById('calendarFilter');
        const eventCalendar = document.getElementById('eventCalendar');
        
        calendarFilter.innerHTML = '<option value="">All Calendars</option>';
        eventCalendar.innerHTML = '';
        
        this.calendars.forEach(cal => {
            const option1 = document.createElement('option');
            option1.value = cal.entity_id;
            option1.textContent = cal.name;
            calendarFilter.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = cal.entity_id;
            option2.textContent = cal.name;
            eventCalendar.appendChild(option2);
        });
    }
    
    populatePersonFilter() {
        const personFilter = document.getElementById('personFilter');
        personFilter.innerHTML = '<option value="">All People</option>';
        
        this.persons.forEach(person => {
            const option = document.createElement('option');
            option.value = person.entity_id;
            option.textContent = person.name;
            personFilter.appendChild(option);
        });
    }
    
    getDateRange() {
        let start, end;
        
        if (this.currentView === 'day') {
            start = new Date(this.currentDate);
            start.setHours(0, 0, 0, 0);
            end = new Date(this.currentDate);
            end.setHours(23, 59, 59, 999);
        } else if (this.currentView === 'week') {
            start = new Date(this.currentDate);
            const day = start.getDay();
            start.setDate(start.getDate() - day);
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else {
            start = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            end = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
        }
        
        return { start, end };
    }
    
    navigate(direction) {
        if (this.currentView === 'day') {
            this.currentDate.setDate(this.currentDate.getDate() + direction);
        } else if (this.currentView === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        }
        this.renderCalendar();
    }
    
    async renderCalendar() {
        await this.loadEvents();
        this.updateDateDisplay();
        
        const calendarView = document.getElementById('calendarView');
        calendarView.innerHTML = '';
        
        if (this.currentView === 'day') {
            this.renderDayView(calendarView);
        } else if (this.currentView === 'week') {
            this.renderWeekView(calendarView);
        } else {
            this.renderMonthView(calendarView);
        }
    }
    
    updateDateDisplay() {
        const currentDateEl = document.getElementById('currentDate');
        
        if (this.currentView === 'day') {
            currentDateEl.textContent = this.currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } else if (this.currentView === 'week') {
            const { start, end } = this.getDateRange();
            currentDateEl.textContent = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else {
            currentDateEl.textContent = this.currentDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });
        }
    }
    
    renderDayView(container) {
        container.className = 'day-view';
        
        for (let hour = 0; hour < 24; hour++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            
            const timeLabel = document.createElement('div');
            timeLabel.className = 'time-label';
            timeLabel.textContent = `${hour}:00`;
            
            const events = document.createElement('div');
            events.className = 'time-events';
            
            // Filter events for this hour
            const slotEvents = this.getEventsForHour(this.currentDate, hour);
            slotEvents.forEach(event => {
                const eventEl = this.createEventElement(event);
                events.appendChild(eventEl);
            });
            
            slot.appendChild(timeLabel);
            slot.appendChild(events);
            container.appendChild(slot);
        }
    }
    
    renderWeekView(container) {
        container.className = 'week-view';
        
        // Header row
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const emptyHeader = document.createElement('div');
        emptyHeader.className = 'week-header';
        container.appendChild(emptyHeader);
        
        const { start } = this.getDateRange();
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            
            const header = document.createElement('div');
            header.className = 'week-header';
            header.textContent = `${days[i]} ${date.getDate()}`;
            container.appendChild(header);
        }
        
        // Week days
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'week-day';
            
            const dayEvents = this.getEventsForDate(date);
            dayEvents.forEach(event => {
                const eventEl = this.createEventElement(event);
                dayCell.appendChild(eventEl);
            });
            
            container.appendChild(dayCell);
        }
    }
    
    renderMonthView(container) {
        container.className = 'month-view';
        
        // Header row
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const header = document.createElement('div');
            header.className = 'month-header';
            header.textContent = day;
            container.appendChild(header);
        });
        
        // Get first day of month
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        
        // Add empty cells for days before month starts
        const startDay = firstDay.getDay();
        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'month-day other-month';
            container.appendChild(emptyCell);
        }
        
        // Add days of month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            const dayCell = document.createElement('div');
            dayCell.className = 'month-day';
            
            if (this.isToday(date)) {
                dayCell.classList.add('today');
            }
            
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            const dayEvents = this.getEventsForDate(date);
            dayEvents.slice(0, 3).forEach(event => {
                const eventEl = this.createEventElement(event);
                dayCell.appendChild(eventEl);
            });
            
            if (dayEvents.length > 3) {
                const more = document.createElement('div');
                more.className = 'event';
                more.style.background = '#999';
                more.textContent = `+${dayEvents.length - 3} more`;
                dayCell.appendChild(more);
            }
            
            container.appendChild(dayCell);
        }
    }
    
    getEventsForDate(date) {
        return this.events.filter(event => {
            const eventStart = new Date(event.start);
            return eventStart.toDateString() === date.toDateString();
        });
    }
    
    getEventsForHour(date, hour) {
        return this.events.filter(event => {
            const eventStart = new Date(event.start);
            return eventStart.toDateString() === date.toDateString() &&
                   eventStart.getHours() === hour;
        });
    }
    
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }
    
    createEventElement(event) {
        const eventEl = document.createElement('div');
        eventEl.className = 'event';
        eventEl.textContent = event.summary || 'Untitled Event';
        
        // Find calendar color
        const calendar = this.calendars.find(c => c.entity_id === event.calendar_id);
        if (calendar) {
            eventEl.style.background = calendar.color;
        }
        
        return eventEl;
    }
    
    showEventModal() {
        const modal = document.getElementById('eventModal');
        const now = new Date();
        const startInput = document.getElementById('eventStart');
        const endInput = document.getElementById('eventEnd');
        
        // Set default times
        startInput.value = this.formatDateTimeLocal(now);
        const end = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
        endInput.value = this.formatDateTimeLocal(end);
        
        modal.classList.add('show');
    }
    
    showTodoModal() {
        const modal = document.getElementById('todoModal');
        const todoList = document.getElementById('todoList');
        
        // Populate todo lists
        todoList.innerHTML = '';
        this.todos.forEach(todo => {
            const option = document.createElement('option');
            option.value = todo.entity_id;
            option.textContent = todo.name;
            todoList.appendChild(option);
        });
        
        modal.classList.add('show');
    }
    
    async createEvent() {
        const data = {
            calendar_id: document.getElementById('eventCalendar').value,
            summary: document.getElementById('eventTitle').value,
            start: new Date(document.getElementById('eventStart').value).toISOString(),
            end: new Date(document.getElementById('eventEnd').value).toISOString(),
            description: document.getElementById('eventDescription').value
        };
        
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                document.getElementById('eventForm').reset();
                await this.renderCalendar();
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }
    }
    
    async createTodo() {
        const data = {
            entity_id: document.getElementById('todoList').value,
            item: document.getElementById('todoItem').value
        };
        
        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                document.getElementById('todoForm').reset();
                await this.loadTodos();
            }
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    }
    
    renderTodos() {
        const container = document.getElementById('todoLists');
        container.innerHTML = '';
        
        this.todos.forEach(todoList => {
            const listEl = document.createElement('div');
            listEl.className = 'todo-list';
            
            const title = document.createElement('h3');
            title.textContent = todoList.name;
            listEl.appendChild(title);
            
            const items = todoList.items || [];
            items.forEach(item => {
                const itemEl = this.createTodoElement(todoList.entity_id, item);
                listEl.appendChild(itemEl);
            });
            
            container.appendChild(listEl);
        });
    }
    
    createTodoElement(listId, item) {
        const itemEl = document.createElement('div');
        itemEl.className = 'todo-item';
        
        if (item.status === 'completed') {
            itemEl.classList.add('completed');
        }
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.status === 'completed';
        checkbox.addEventListener('change', () => this.toggleTodo(listId, item.uid, checkbox.checked));
        
        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = item.summary || item.item || 'Untitled';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'todo-delete';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => this.deleteTodo(listId, item.uid));
        
        itemEl.appendChild(checkbox);
        itemEl.appendChild(text);
        itemEl.appendChild(deleteBtn);
        
        return itemEl;
    }
    
    async toggleTodo(listId, itemId, completed) {
        const entityId = listId.replace('todo.', '');
        const status = completed ? 'completed' : 'needs_action';
        
        try {
            await fetch(`/api/todos/${entityId}/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            
            await this.loadTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    }
    
    async deleteTodo(listId, itemId) {
        const entityId = listId.replace('todo.', '');
        
        try {
            await fetch(`/api/todos/${entityId}/${itemId}`, {
                method: 'DELETE'
            });
            
            await this.loadTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    }
    
    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new SkylightCalendar();
});
