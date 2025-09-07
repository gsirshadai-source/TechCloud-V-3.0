// Modern TechCloud JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.modern-nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile navbar collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }

    // Enhanced Contact form handling with Supabase integration
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            console.log('Contact form submitted'); // Debug log
            
            // Get form data with more specific selectors
            const nameInput = this.querySelector('input[placeholder="Your Name"]');
            const emailInput = this.querySelector('input[placeholder="Your Email"]');
            const subjectInput = this.querySelector('input[placeholder="Subject"]');
            const messageInput = this.querySelector('textarea[placeholder="Your Message"]');
            
            // Check if elements exist
            if (!nameInput || !emailInput || !subjectInput || !messageInput) {
                console.error('Form elements not found:', {
                    nameInput: !!nameInput,
                    emailInput: !!emailInput,
                    subjectInput: !!subjectInput,
                    messageInput: !!messageInput
                });
                showNotification('Form configuration error. Please refresh the page.', 'error');
                return;
            }
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput.value.trim();
            const message = messageInput.value.trim();
            
            console.log('Form data:', { name, email, subject, message }); // Debug log
            
            // Validate form data
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]') || this.querySelector('.btn');
            const originalText = submitButton ? submitButton.textContent : '';
            if (submitButton) {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
            }
            
            try {
                // Check if Supabase is available
                console.log('Checking Supabase availability...'); // Debug log
                console.log('window.supabase:', typeof window.supabase); // Debug log
                console.log('window.contactFormHandler:', typeof window.contactFormHandler); // Debug log
                
                if (typeof window.supabase === 'undefined') {
                    throw new Error('Supabase library not loaded. Please check your internet connection.');
                }
                
                if (typeof window.contactFormHandler === 'undefined') {
                    throw new Error('Contact form handler not initialized. Please refresh the page.');
                }
                
                console.log('Submitting to Supabase...'); // Debug log
                
                // Submit to Supabase
                const result = await window.contactFormHandler.submitContactMessage({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message
                });
                
                console.log('Supabase result:', result); // Debug log
                
                if (result.success) {
                    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    console.error('Supabase error:', result.error); // Debug log
                    throw new Error(result.message || result.error || 'Failed to send message');
                }
                
            } catch (error) {
                console.error('Contact form error:', error); // Debug log
                console.error('Error stack:', error.stack); // Debug log
                
                let errorMessage = 'Failed to send message. Please try again.';
                
                // Provide more specific error messages
                if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                } else if (error.message.includes('not found')) {
                    errorMessage = 'Database table not found. Please contact support.';
                } else if (error.message.includes('permission')) {
                    errorMessage = 'Permission denied. Please contact support.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                showNotification(errorMessage, 'error');
            } finally {
                // Reset button state
                if (submitButton) {
                    submitButton.textContent = originalText || 'Send Message';
                    submitButton.disabled = false;
                }
            }
        });
    }

    // Add loading animation to launch buttons
    const launchButtons = document.querySelectorAll('.launch-btn');
    launchButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.pointerEvents = 'none';
            
            // Reset after a short delay (for visual feedback)
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 1000);
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and app cards for animation
    const animatedElements = document.querySelectorAll('.service-card-modern, .app-card, .tech-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fa ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fa fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        color: white;
        font-family: 'Inter', sans-serif;
        animation: slideInRight 0.3s ease;
        background: ${getNotificationColor(type)};
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        case 'error': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        case 'warning': return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
        default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);