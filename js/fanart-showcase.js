// Fanart Showcase Interactivity
document.addEventListener('DOMContentLoaded', function() {
    // Get all fanart items
    const fanartItems = document.querySelectorAll('.fanart-item');
    
    // Function to handle touch/click events
    function handleInteraction(item, event) {
        // Prevent default behavior
        if (event.type === 'touchstart' || event.target.tagName !== 'A') {
            event.preventDefault();
        }
        
        // Check if this is a real click (not the end of a scroll)
        if (event.type === 'click' && window.scrollY !== window._scrollPosition) {
            return;
        }
        
        // Toggle active class
        const isActive = item.classList.contains('active');
        
        // Remove active class from all items
        fanartItems.forEach(i => {
            if (i !== item) i.classList.remove('active');
        });
        
        // Toggle active class on current item
        if (!isActive) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    }
    
    // Track scroll position to differentiate between scrolls and clicks
    window._scrollPosition = window.scrollY;
    window.addEventListener('scroll', function() {
        window._scrollPosition = window.scrollY;
    });
    
    // Add event listeners for all devices
    fanartItems.forEach(item => {
        // For mobile devices
        item.addEventListener('touchstart', function(e) {
            handleInteraction(this, e);
        }, { passive: false });
        
        // For desktop devices
        item.addEventListener('click', function(e) {
            // Only handle clicks on non-links
            if (e.target.tagName !== 'A') {
                handleInteraction(this, e);
            }
        });
        
        // Close on touch outside
        document.addEventListener('touchstart', function(e) {
            if (!item.contains(e.target)) {
                item.classList.remove('active');
            }
        }, { passive: true });
        
        // Close on click outside
        document.addEventListener('click', function(e) {
            if (!item.contains(e.target)) {
                item.classList.remove('active');
            }
        });
    });
    
    // Add subtle parallax effect on mouse move (desktop only)
    const fanartShowcase = document.querySelector('.fanart-showcase');
    if (fanartShowcase && window.innerWidth > 768) {
        fanartShowcase.addEventListener('mousemove', function(e) {
            const items = document.querySelectorAll('.fanart-item');
            
            items.forEach(item => {
                const rect = item.getBoundingClientRect();
                const itemX = rect.left + rect.width / 2;
                const itemY = rect.top + rect.height / 2;
                
                const offsetX = ((e.clientX - itemX) / 25);
                const offsetY = ((e.clientY - itemY) / 25);
                
                // Only apply effect to nearby items
                const distance = Math.sqrt(Math.pow(e.clientX - itemX, 2) + Math.pow(e.clientY - itemY, 2));
                const maxDistance = 300;
                
                if (distance < maxDistance) {
                    const scale = 1 - (distance / maxDistance);
                    item.querySelector('.fanart-frame').style.transform = 
                        `rotateY(${offsetX * scale}deg) rotateX(${-offsetY * scale}deg)`;
                } else {
                    item.querySelector('.fanart-frame').style.transform = 'rotateY(0deg) rotateX(0deg)';
                }
            });
        });
        
        // Reset transforms when mouse leaves the showcase
        fanartShowcase.addEventListener('mouseleave', function() {
            const items = document.querySelectorAll('.fanart-item');
            items.forEach(item => {
                item.querySelector('.fanart-frame').style.transform = 'rotateY(0deg) rotateX(0deg)';
            });
        });
    }
});