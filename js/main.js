/* ============================================
   Photography & Filmmaking Coaching Website
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Navigation.init();
    ScrollReveal.init();
    SmoothScroll.init();
    CourseFilter.init();
    FormValidation.init();
});

/* ==================== NAVIGATION MODULE ==================== */
const Navigation = {
    init: function() {
        this.header = document.querySelector('.header');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        
        this.bindEvents();
        this.handleScroll();
    },
    
    bindEvents: function() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking nav links
        if (this.navMenu) {
            this.navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.nav-toggle')) {
                    this.closeMenu();
                }
            }
        });
        
        // Handle scroll
        window.addEventListener('scroll', () => this.handleScroll());
    },
    
    toggleMenu: function() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },
    
    closeMenu: function() {
        if (this.navToggle) this.navToggle.classList.remove('active');
        if (this.navMenu) this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    handleScroll: function() {
        if (this.header) {
            if (window.scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        }
    }
};

/* ==================== SCROLL REVEAL MODULE ==================== */
const ScrollReveal = {
    init: function() {
        this.revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        
        if (this.revealElements.length > 0) {
            this.observer = new IntersectionObserver(
                (entries) => this.handleIntersection(entries),
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                }
            );
            
            this.revealElements.forEach(el => this.observer.observe(el));
        }
    },
    
    handleIntersection: function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                this.observer.unobserve(entry.target);
            }
        });
    }
};

/* ==================== SMOOTH SCROLL MODULE ==================== */
const SmoothScroll = {
    init: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
        });
    },
    
    handleClick: function(e, anchor) {
        const targetId = anchor.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
};

/* ==================== COURSE FILTER MODULE ==================== */
const CourseFilter = {
    init: function() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.courseCards = document.querySelectorAll('.course-card');
        
        if (this.filterButtons.length > 0) {
            this.bindEvents();
        }
    },
    
    bindEvents: function() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.filterCourses(btn));
        });
    },
    
    filterCourses: function(clickedBtn) {
        const filter = clickedBtn.getAttribute('data-filter');
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        
        // Filter courses
        this.courseCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }
};

/* ==================== FORM VALIDATION MODULE ==================== */
const FormValidation = {
    init: function() {
        this.form = document.getElementById('contact-form');
        
        if (this.form) {
            this.bindEvents();
        }
    },
    
    bindEvents: function() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.form.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    },
    
    handleSubmit: function(e) {
        e.preventDefault();
        
        let isValid = true;
        const inputs = this.form.querySelectorAll('.form-control[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.showSuccess();
            this.form.reset();
        }
    },
    
    validateField: function(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;
        let message = '';
        
        // Check if empty
        if (!value) {
            isValid = false;
            message = 'This field is required';
        }
        // Validate email
        else if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }
        // Validate phone
        else if (name === 'phone') {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }
        
        if (!isValid) {
            this.showError(input, message);
        } else {
            this.clearError(input);
        }
        
        return isValid;
    },
    
    showError: function(input, message) {
        this.clearError(input);
        
        input.style.borderColor = '#e31837';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #e31837; font-size: 0.8rem; margin-top: 0.25rem;';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    },
    
    clearError: function(input) {
        input.style.borderColor = '';
        
        const errorDiv = input.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    },
    
    showSuccess: function() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a1a1a;
            border: 2px solid #e31837;
            padding: 2rem 3rem;
            border-radius: 16px;
            text-align: center;
            z-index: 9999;
            animation: scaleIn 0.3s ease forwards;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 3rem; color: #e31837; margin-bottom: 1rem; display: block;"></i>
            <h4 style="color: #fff; margin-bottom: 0.5rem;">Message Sent!</h4>
            <p style="color: #8a8a8a;">We'll get back to you soon.</p>
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9998;
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.remove();
            overlay.remove();
        }, 3000);
    }
};

/* ==================== TESTIMONIALS SLIDER (Optional) ==================== */
const TestimonialSlider = {
    init: function() {
        this.slider = document.querySelector('.testimonials-slider');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.currentIndex = 0;
        
        if (this.cards.length > 1) {
            this.createDots();
            this.startAutoplay();
        }
    },
    
    createDots: function() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        dotsContainer.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1.5rem;
        `;
        
        this.cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.style.cssText = `
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: ${index === 0 ? '#e31837' : '#4a4a4a'};
                cursor: pointer;
                transition: background 0.3s ease;
            `;
            dot.addEventListener('click', () => this.goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        
        this.slider.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider-dot');
    },
    
    goToSlide: function(index) {
        this.cards.forEach((card, i) => {
            card.style.display = i === index ? 'block' : 'none';
        });
        
        this.dots.forEach((dot, i) => {
            dot.style.background = i === index ? '#e31837' : '#4a4a4a';
        });
        
        this.currentIndex = index;
    },
    
    startAutoplay: function() {
        setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.cards.length;
            this.goToSlide(nextIndex);
        }, 5000);
    }
};

/* ==================== COUNTER ANIMATION ==================== */
const CounterAnimation = {
    init: function() {
        const counters = document.querySelectorAll('.stat-item .number');
        
        if (counters.length > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateCounter(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );
            
            counters.forEach(counter => observer.observe(counter));
        }
    },
    
    animateCounter: function(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };
        
        updateCounter();
    }
};

// Initialize counter animation
document.addEventListener('DOMContentLoaded', function() {
    CounterAnimation.init();
});
