// calendar.js - Handles calendar functionality and event display

document.addEventListener("DOMContentLoaded", function() {
    // Calendar Navigation
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const currentMonthDisplay = document.querySelector('.current-month');
    
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Update calendar when navigation buttons are clicked
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
    
    // Function to update the calendar
    function updateCalendar() {
        // Update month name in header
        const monthNames = ["January", "February", "March", "April", "May", "June",
                           "July", "August", "September", "October", "November", "December"];
        currentMonthDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        
        // Get first day of month and total days in month
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        
        // Get days of previous month for padding
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        
        // Clear calendar dates
        const calendarDates = document.querySelector('.calendar-dates');
        calendarDates.innerHTML = '';
        
        // Add previous month's days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dateEl = document.createElement('div');
            dateEl.classList.add('date', 'prev-month-date');
            dateEl.textContent = prevMonthDays - i;
            calendarDates.appendChild(dateEl);
        }
        
        // Add current month's days
        const events = getEvents(currentMonth, currentYear);
        for (let i = 1; i <= daysInMonth; i++) {
            const dateEl = document.createElement('div');
            dateEl.classList.add('date');
            dateEl.textContent = i;
            
            // Check if there's an event on this day
            if (events.some(event => new Date(event.date).getDate() === i)) {
                const eventDot = document.createElement('span');
                eventDot.classList.add('event-dot');
                dateEl.appendChild(eventDot);
                
                // Add click event to show event details
                dateEl.addEventListener('click', function() {
                    showEventDetails(i, currentMonth, currentYear);
                });
            }
            
            calendarDates.appendChild(dateEl);
        }
        
        // Calculate how many days to show from next month
        const totalDaysShown = firstDay + daysInMonth;
        const remainingCells = 7 - (totalDaysShown % 7);
        
        // Add next month's days
        if (remainingCells < 7) {
            for (let i = 1; i <= remainingCells; i++) {
                const dateEl = document.createElement('div');
                dateEl.classList.add('date', 'next-month-date');
                dateEl.textContent = i;
                calendarDates.appendChild(dateEl);
            }
        }
        
        // Update events list to show current month's events
        updateEventsList(events);
    }
    
    // Function to get events for a specific month
    function getEvents(month, year) {
        // This would ideally be fetched from a database
        // For now, we'll use hardcoded events
        const allEvents = [
            { date: "2025-05-02", title: "UNIS Livestream Watch Party", location: "Cafe K-Hub, Makati", time: "7:00 PM", id: 231 },
            { date: "2025-05-05", title: "YUNHAverse PH Online Meeting", location: "Discord", time: "8:00 PM", id: 232 },
            { date: "2025-05-10", title: "Photocard Trading Event", location: "SM North EDSA", time: "1:00 PM", id: 233 },
            { date: "2025-05-15", title: "K-pop Convention UNIS Booth", location: "SMX Convention Center", time: "All Day", id: 234 },
            { date: "2025-05-24", title: "Yunha Birthday Project Planning", location: "Cafe K-Hub, Makati", time: "3:00 PM", id: 235 },
            { date: "2025-06-10", title: "UNIS Fan Meet in Manila", location: "New Frontier Theater", time: "7:00 PM", id: 236 },
            { date: "2025-06-15", title: "UNIS Album Group Order Deadline", location: "Online", time: "11:59 PM", id: 237 },
            { date: "2025-07-15", title: "UNIS Comeback", location: "Online Streaming", time: "6:00 PM", id: 238 },
            { date: "2025-02-28", title: "Yunha's Birthday Celebration", location: "Gateway Mall, Cubao", time: "4:00 PM", id: 239 }
        ];
        
        // Filter events for the selected month and year
        return allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === month && eventDate.getFullYear() === year;
        });
    }
    
    // Function to update events list
    function updateEventsList(events) {
        const eventList = document.querySelector('.event-list');
        eventList.innerHTML = '';
        
        if (events.length === 0) {
            const noEventsItem = document.createElement('li');
            noEventsItem.classList.add('event-item', 'no-events');
            noEventsItem.textContent = 'No events scheduled for this month';
            eventList.appendChild(noEventsItem);
            return;
        }
        
        // Sort events by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Create event items
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthName = monthNames[eventDate.getMonth()];
            
            const eventItem = document.createElement('li');
            eventItem.classList.add('event-item');
            
            eventItem.innerHTML = `
                <div class="event-date">${monthName} ${day}</div>
                <div class="event-details">
                    <h5>${event.title}</h5>
                    <p>${event.time} @ ${event.location}</p>
                    <a href="events.php?id=${event.id}" class="event-link">View Details</a>
                </div>
            `;
            
            eventList.appendChild(eventItem);
        });
    }
    
    // Function to show event details when a date is clicked
    function showEventDetails(day, month, year) {
        const events = getEvents(month, year).filter(event => 
            new Date(event.date).getDate() === day
        );
        
        if (events.length === 0) return;
        
        // Highlight the clicked date
        document.querySelectorAll('.date').forEach(date => {
            if (!date.classList.contains('prev-month-date') && 
                !date.classList.contains('next-month-date') && 
                parseInt(date.textContent) === day) {
                date.style.backgroundColor = '#fff0f7';
            } else {
                date.style.backgroundColor = '';
            }
        });
        
        // Update event list to show only events for the selected day
        updateEventsList(events);
    }
    
    // Initialize calendar
    updateCalendar();
    
    // Initialize date click handlers
    document.querySelectorAll('.date').forEach(date => {
        if (!date.classList.contains('prev-month-date') && !date.classList.contains('next-month-date')) {
            date.addEventListener('click', function() {
                const day = parseInt(this.textContent);
                showEventDetails(day, currentMonth, currentYear);
            });
        }
    });
});