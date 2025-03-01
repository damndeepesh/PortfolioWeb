/**
 * Japanese Notebook Portfolio
 * Main JavaScript file
 * @author Deepesh Gupta
 */

// Preload theme assets before showing content
window.addEventListener('DOMContentLoaded', () => {
    // Create preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(preloader);
    
    // Preload theme assets
    const lightBg = new Image();
    lightBg.src = 'img/rice-paper-light.png';
    
    const darkBg = new Image();
    darkBg.src = 'img/sumi-e-dark.png';
    
    // Count loaded assets
    let loadedAssets = 0;
    const totalAssets = 2;
    
    function assetLoaded() {
        loadedAssets++;
        if (loadedAssets >= totalAssets) {
            // Hide preloader with a fade effect
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                    document.body.classList.add('content-loaded');
                }, 300);
            }, 300); // Small delay for smoother transition
        }
    }
    
    lightBg.onload = assetLoaded;
    darkBg.onload = assetLoaded;
    
    // Fallback in case images don't load
    setTimeout(() => {
        if (loadedAssets < totalAssets) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
                document.body.classList.add('content-loaded');
            }, 300);
        }
    }, 2000);
});

// Use passive event listeners for better performance
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements for better performance
    const mainNav = document.querySelector('.main-nav');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const verticalTexts = document.querySelectorAll('.vertical-text');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Detect device type - make these variables let instead of const so they can be updated
    let isMobile = window.innerWidth <= 768;
    let isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
    let isDesktop = window.innerWidth > 992;
    
    // Log window width for debugging
    console.log("Window width: " + window.innerWidth);
    console.log("isMobile: " + isMobile);
    console.log("isTablet: " + isTablet);
    console.log("isDesktop: " + isDesktop);

    // Set initial body classes based on device type
    if (isMobile) {
        document.body.classList.add('is-mobile');
        document.body.classList.remove('is-tablet', 'is-desktop');
    } else if (isTablet) {
        document.body.classList.add('is-tablet');
        document.body.classList.remove('is-mobile', 'is-desktop');
    } else {
        document.body.classList.add('is-desktop');
        document.body.classList.remove('is-mobile', 'is-tablet');
    }
    
    // Fix navbar positioning issues
    if (mainNav) {
        // Remove any transform styles that might be causing issues
        mainNav.style.transform = 'none';
        mainNav.style.webkitTransform = 'none';
    }
    
    // Fix vertical text rotation
    if (verticalTexts.length > 0 && !isMobile) {
        verticalTexts.forEach(text => {
            text.style.transform = 'rotate(180deg)';
            text.style.webkitTransform = 'rotate(180deg)';
            text.style.display = 'inline-block';
        });
    }
    
    // Fix navigation links rotation
    if (navLinks.length > 0 && !isMobile) {
        navLinks.forEach(link => {
            link.style.transform = 'rotate(180deg)';
            link.style.webkitTransform = 'rotate(180deg)';
        });
    }
    
    // Navigation Active State - Optimized with requestAnimationFrame
    let ticking = false;
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Adjust the offset for mobile to account for the bottom navigation
            const offset = isMobile ? 100 : 200;
            
            if (scrollPosition >= (sectionTop - offset) && 
                scrollPosition < (sectionTop + sectionHeight - offset)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
        
        ticking = false;
    }
    
    // Use requestAnimationFrame for scroll events
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveNavLink();
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Fix navbar hover behavior on desktop
    if (isDesktop) {
        mainNav.addEventListener('mouseenter', () => {
            mainNav.classList.add('nav-hover');
        });
        
        mainNav.addEventListener('mouseleave', () => {
            mainNav.classList.remove('nav-hover');
        });
    }
    
    // Smooth Scroll for Navigation Links with improved mobile experience
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            
            // Add active state visual feedback for mobile
            if (isMobile) {
                link.classList.add('nav-item-active');
                setTimeout(() => {
                    link.classList.remove('nav-item-active');
                }, 300);
            }
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (!targetSection) return; // Safety check
            
            // Adjust scroll position for mobile to account for bottom navigation
            const offset = isMobile ? 60 : 0;
            const targetPosition = targetSection.offsetTop - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active state
            navLinks.forEach(l => {
                l.classList.remove('active');
                l.removeAttribute('aria-current');
            });
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        });
    });
    
    // Add double-tap to top functionality for mobile
    if (isMobile) {
        let lastTap = 0;
        mainNav.addEventListener('touchstart', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            // Detect double tap (within 300ms)
            if (tapLength < 300 && tapLength > 0) {
                // Double tap detected - scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                e.preventDefault();
            }
            
            lastTap = currentTime;
        });
    }
    
    // Handle window resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize events
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Update device detection variables
            isMobile = window.innerWidth <= 768;
            isTablet = window.innerWidth <= 992 && window.innerWidth > 768;
            isDesktop = window.innerWidth > 992;
            
            console.log("Resize - Window width: " + window.innerWidth);
            console.log("Resize - isMobile: " + isMobile);
            
            // Update body classes based on device type
            if (isMobile) {
                document.body.classList.add('is-mobile');
                document.body.classList.remove('is-tablet', 'is-desktop');
            } else if (isTablet) {
                document.body.classList.add('is-tablet');
                document.body.classList.remove('is-mobile', 'is-desktop');
            } else {
                document.body.classList.add('is-desktop');
                document.body.classList.remove('is-mobile', 'is-tablet');
            }
            
            // Fix navbar positioning on resize
            if (mainNav) {
                mainNav.style.transform = 'none';
                mainNav.style.webkitTransform = 'none';
            }
            
            // Fix vertical text rotation on resize
            const newIsMobile = window.innerWidth <= 768;
            
            if (verticalTexts.length > 0) {
                verticalTexts.forEach(text => {
                    if (newIsMobile) {
                        text.style.transform = 'none';
                        text.style.webkitTransform = 'none';
                    } else {
                        text.style.transform = 'rotate(180deg)';
                        text.style.webkitTransform = 'rotate(180deg)';
                    }
                });
            }
            
            if (navLinks.length > 0) {
                navLinks.forEach(link => {
                    if (newIsMobile) {
                        link.style.transform = 'none';
                        link.style.webkitTransform = 'none';
                    } else {
                        link.style.transform = 'rotate(180deg)';
                        link.style.webkitTransform = 'rotate(180deg)';
                    }
                });
            }
            
            // Update device detection
            const wasIsMobile = isMobile;
            const wasIsTablet = isTablet;
            const wasIsDesktop = isDesktop;
            
            // Only reload if device category changed
            if (wasIsMobile !== newIsMobile || 
                wasIsTablet !== (window.innerWidth <= 992 && window.innerWidth > 768) || 
                wasIsDesktop !== (window.innerWidth > 992)) {
                location.reload();
            }
        }, 250);
    }, { passive: true });
    
    // Initialize the active nav link on page load
    updateActiveNavLink();
    
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Add a success message container that will be shown after form submission
        const formContainer = contactForm.parentElement;
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.style.display = 'none';
        successMessage.innerHTML = `
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
        `;
        formContainer.appendChild(successMessage);
        
        contactForm.addEventListener('submit', e => {
            e.preventDefault(); // Prevent the default form submission
            
            // Show a loading state on the button
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Send form data to Formspree using fetch API
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Hide the form
                contactForm.style.display = 'none';
                // Show success message
                successMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                
                // Show form again after 5 seconds
                setTimeout(() => {
                    contactForm.style.display = 'block';
                    successMessage.style.display = 'none';
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                // Show error message
                alert('There was a problem sending your message. Please try again later.');
                
                // Reset button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Page Transition Effects - optimized for mobile
    function addIntersectionObserver() {
        const elements = document.querySelectorAll('.section > .container');
        
        // Use a lower threshold on mobile for better performance
        const threshold = isMobile ? 0.05 : 0.1;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: threshold });
        
        elements.forEach(element => {
            observer.observe(element);
            // Add initial hidden state via CSS
            element.classList.add('fade-in');
        });
    }
    
    // Initialize intersection observer
    addIntersectionObserver();
    
    // Fix any navbar positioning issues after page is fully loaded
    window.addEventListener('load', () => {
        if (mainNav) {
            mainNav.style.transform = 'none';
            mainNav.style.webkitTransform = 'none';
            
            // Force a reflow to ensure the navbar is properly positioned
            void mainNav.offsetWidth;
        }
        
        // Fix vertical text rotation after page load
        if (verticalTexts.length > 0 && !isMobile) {
            verticalTexts.forEach(text => {
                text.style.transform = 'rotate(180deg)';
                text.style.webkitTransform = 'rotate(180deg)';
                text.style.display = 'inline-block';
            });
        }
        
        // Fix navigation links rotation after page load
        if (navLinks.length > 0 && !isMobile) {
            navLinks.forEach(link => {
                link.style.transform = 'rotate(180deg)';
                link.style.webkitTransform = 'rotate(180deg)';
            });
        }
    });

    // Log window width for debugging
    console.log("Window width: " + window.innerWidth);
}); 