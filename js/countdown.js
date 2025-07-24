// countdown.js - Handles countdown timers for important dates

document.addEventListener("DOMContentLoaded", function() {
    // Get all countdown buttons
    const countdownBtns = document.querySelectorAll('.countdown-btn');
    
    // Special dates to countdown to (these could come from a database)
    const specialDates = [
        { date: "2025-02-28", event: "Yunha's Birthday" },
        { date: "2025-07-15", event: "UNIS Comeback" },
        { date: "2025-06-10", event: "Fanmeet in Manila" }
    ];
    
    // Active countdown event
    let activeCountdown = document.querySelector('.countdown-event.active');
    let activeTimerInterval;
    
    // Initialize countdown buttons
    countdownBtns.forEach((btn, index) => {
        // Get the data from button attributes or use default from the array
        const btnDate = btn.getAttribute('data-date') || specialDates[index].date;
        const btnEvent = btn.getAttribute('data-event') || specialDates[index].event;
        
        // Store data in button attributes
        btn.setAttribute('data-date', btnDate);
        btn.setAttribute('data-event', btnEvent);
        
        // Add click event
        btn.addEventListener('click', function() {
            // Clear previous timer
            if (activeTimerInterval) {
                clearInterval(activeTimerInterval);
            }
            
            // Remove active class from all events
            document.querySelectorAll('.countdown-event').forEach(event => {
                event.classList.remove('active');
            });
            
            // Remove active class from all buttons
            countdownBtns.forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Create or update countdown event
            createCountdownEvent(btnDate, btnEvent);
        });
    });
    
    // Function to create or update countdown event
    function createCountdownEvent(dateStr, eventName) {
        // Check if there's already a countdown container
        let countdownEvent = document.querySelector('.countdown-event');
        
        if (!countdownEvent) {
            // Create countdown container if it doesn't exist
            countdownEvent = document.createElement('div');
            countdownEvent.classList.add('countdown-event');
            document.querySelector('.countdown-container').prepend(countdownEvent);
        }
        
        // Update countdown event content
        countdownEvent.innerHTML = `
            <div class="event-info">
                <h3>${eventName}</h3>
                <p>${formatDate(dateStr)}</p>
            </div>
            <div class="countdown-timer">
                <div class="countdown-item">
                    <span class="countdown-value days">--</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value hours">--</span>
                    <span class="countdown-label">Hours</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value minutes">--</span>
                    <span class="countdown-label">Mins</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-value seconds">--</span>
                    <span class="countdown-label">Secs</span>
                </div>
            </div>
        `;
        
        // Add active class
        countdownEvent.classList.add('active');
        
        // Set target date and start countdown
        const targetDate = new Date(dateStr).getTime();
        updateCountdown(targetDate);
        
        // Set interval to update countdown every second
        activeTimerInterval = setInterval(function() {
            updateCountdown(targetDate);
        }, 1000);
    }
    
    // Function to update countdown values
    function updateCountdown(targetDate) {
        // Get current date and time
        const now = new Date().getTime();
        
        // Calculate time difference
        const difference = targetDate - now;
        
        if (difference < 0) {
            // If date is in the past
            document.querySelector('.countdown-value.days').textContent = "0";
            document.querySelector('.countdown-value.hours').textContent = "0";
            document.querySelector('.countdown-value.minutes').textContent = "0";
            document.querySelector('.countdown-value.seconds').textContent = "0";
            
            if (activeTimerInterval) {
                clearInterval(activeTimerInterval);
            }
            
            return;
        }
        
        // Calculate time units
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        // Update countdown values
        document.querySelector('.countdown-value.days').textContent = days;
        document.querySelector('.countdown-value.hours').textContent = hours < 10 ? `0${hours}` : hours;
        document.querySelector('.countdown-value.minutes').textContent = minutes < 10 ? `0${minutes}` : minutes;
        document.querySelector('.countdown-value.seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
    }
    
    // Helper function to format date
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Initialize first countdown (if there are buttons)
    if (countdownBtns.length > 0) {
        countdownBtns[0].classList.add('active');
        const firstDate = countdownBtns[0].getAttribute('data-date');
        const firstEvent = countdownBtns[0].getAttribute('data-event');
        createCountdownEvent(firstDate, firstEvent);
    }
});