document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const flipCards = document.querySelectorAll('.flip-card');
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Initialize carousel position
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Reset all flip cards when changing slides
        flipCards.forEach(card => {
            card.classList.remove('flipped');
        });
    }
    
    // Auto advance carousel
    let carouselInterval = setInterval(nextSlide, 5000);
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }
    
    function resetInterval() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 5000);
    }
    
    // Add click handlers to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentIndex = parseInt(this.getAttribute('data-index'));
            updateCarousel();
            resetInterval();
        });
    });
    
    // Flip card functionality
    flipCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent flipping if clicking on social buttons
            if (e.target.closest('.social-btn')) {
                return;
            }
            
            this.classList.toggle('flipped');
            
            // Reset auto-rotation when interacting with flip cards
            resetInterval();
        });
    });
    
    // Social button click handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent card flip when clicking social buttons
            
            const platform = this.getAttribute('data-platform');
            
            // Add your social media links here
            const socialLinks = {
                facebook: 'https://facebook.com/your-page', // Replace with your Facebook link
                instagram: 'https://instagram.com/your-account', // Replace with your Instagram link
                twitter: 'https://twitter.com/your-account' // Replace with your Twitter link
            };
            
            if (socialLinks[platform]) {
                window.open(socialLinks[platform], '_blank');
            }
        });
    });
    
    // Touch/swipe functionality for carousel navigation
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartTime = Date.now();
        isDragging = false;
        
        // Pause auto rotation on touch
        clearInterval(carouselInterval);
    }, {passive: true});
    
    carousel.addEventListener('touchmove', function(e) {
        isDragging = true;
    }, {passive: true});
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const touchDuration = Date.now() - touchStartTime;
        
        // Only handle swipe if it was a quick gesture and had sufficient movement
        if (isDragging && touchDuration < 300) {
            handleSwipe();
        }
        
        // Resume auto rotation
        resetInterval();
    }, {passive: true});
    
    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next slide
            nextSlide();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous slide
            currentIndex = (currentIndex - 1 + slideCount) % slideCount;
            updateCarousel();
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateCarousel();
    });
    
    // Auto-flip cards back after 4 seconds
    flipCards.forEach(card => {
        let flipTimeout;
        
        card.addEventListener('click', function(e) {
            if (e.target.closest('.social-btn')) {
                return;
            }
            
            // Clear existing timeout
            clearTimeout(flipTimeout);
            
            // If card is being flipped to show back, set timeout to flip back
            if (this.classList.contains('flipped')) {
                flipTimeout = setTimeout(() => {
                    this.classList.remove('flipped');
                }, 4000);
            }
        });
    });
});