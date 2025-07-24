document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.querySelector('.menu-overlay');
    
    // Toggle menu function with enhanced animation
    function toggleMenu() {
        mobileMenuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        overlay.classList.toggle('active');
        
        // Prevent body scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Add click event to toggle
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking on overlay
    overlay.addEventListener('click', function() {
        toggleMenu();
    });
    
    // Close menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            toggleMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks.classList.contains('active') && 
            !event.target.closest('.nav-links') && 
            !event.target.closest('.mobile-menu-toggle')) {
            toggleMenu();
        }
    });
    
    // Handle resize events to reset menu state when switching between mobile and desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Detect if device has true hover capability
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    
    // Only add these touch event handlers on touch devices
    if (!hasHover) {
        const touchElements = document.querySelectorAll('.nav-item, .social-icons a, .footer-links a, .login-btn');
        
        touchElements.forEach(function(element) {
            // Add active state on touch start
            element.addEventListener('touchstart', function(e) {
                // Remove touch-active class from all elements first
                touchElements.forEach(el => el.classList.remove('touch-active'));
                // Add to current element
                this.classList.add('touch-active');
            }, {passive: true});
            
            // Remove active state on touch end
            element.addEventListener('touchend', function() {
                // Small delay before removing the class for better visual feedback
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, {passive: true});
            
            // Also remove on touch move (if user drags away)
            element.addEventListener('touchmove', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
            
            // Cancel active state if touch is canceled
            element.addEventListener('touchcancel', function() {
                this.classList.remove('touch-active');
            }, {passive: true});
        });
        
        // Clear all touch states when touching elsewhere on the document
        document.addEventListener('touchstart', function(e) {
            if (!e.target.closest('.nav-item') && 
                !e.target.closest('.social-icons a') && 
                !e.target.closest('.footer-links a') && 
                !e.target.closest('.login-btn')) {
                touchElements.forEach(el => el.classList.remove('touch-active'));
            }
        }, {passive: true});
    }

    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Initialize carousel position
    function updateCarousel() {
        // Apply transform to move the carousel
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Auto advance carousel
    let carouselInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }
    
    // Reset interval when manually changing slides
    function resetInterval() {
        clearInterval(carouselInterval);
        carouselInterval = setInterval(nextSlide, 4000);
    }
    
    // Add click handlers to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            currentIndex = parseInt(this.getAttribute('data-index'));
            updateCarousel();
            resetInterval();
        });
    });
    
    // Touch/swipe functionality for carousel
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        // Pause auto rotation on touch
        clearInterval(carouselInterval);
    }, {passive: true});
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
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
        // Re-initialize carousel position on resize
        updateCarousel();
    });
});