/**
 * Simple Theme Toggle Implementation
 * This script handles theme switching between light and dark modes
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Theme toggle script loaded');
    
    // Cache DOM elements
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const html = document.documentElement;
    
    // Theme variables
    const LIGHT_MODE = 'light-mode';
    const DARK_MODE = 'dark-mode';
    const USER_PREF_KEY = 'theme-preference';
    
    // Light mode variables
    const LIGHT_VARS = {
        '--bg': '#F8F5F2',
        '--text': '#333333',
        '--accent-primary': '#465775',
        '--accent-secondary': '#D05A3F',
        '--border': '#CCCCCC',
        '--card-bg': '#FFFFFF'
    };
    
    // Dark mode variables
    const DARK_VARS = {
        '--bg': '#1A1B25',
        '--text': '#F2F2F2',
        '--accent-primary': '#5F8787',
        '--accent-secondary': '#D4A5A5',
        '--border': '#444444',
        '--card-bg': '#252632'
    };
    
    // Apply theme CSS variables
    function applyTheme(isDark) {
        console.log('Applying theme:', isDark ? 'dark' : 'light');
        
        // Add transition class
        html.classList.add('theme-transition');
        
        // Apply CSS variables
        const vars = isDark ? DARK_VARS : LIGHT_VARS;
        Object.entries(vars).forEach(([key, value]) => {
            html.style.setProperty(key, value);
        });
        
        // Force a repaint
        void html.offsetHeight;
        
        // Remove transition class after transition completes
        setTimeout(() => {
            html.classList.remove('theme-transition');
        }, 400);
    }
    
    // Set theme based on class
    function setTheme(isDark) {
        if (isDark) {
            body.classList.remove(LIGHT_MODE);
            body.classList.add(DARK_MODE);
            localStorage.setItem(USER_PREF_KEY, DARK_MODE);
        } else {
            body.classList.remove(DARK_MODE);
            body.classList.add(LIGHT_MODE);
            localStorage.setItem(USER_PREF_KEY, LIGHT_MODE);
        }
        
        applyTheme(isDark);
    }
    
    // Initialize theme
    function initTheme() {
        const savedTheme = localStorage.getItem(USER_PREF_KEY);
        
        if (savedTheme) {
            // Use saved preference
            const isDark = savedTheme === DARK_MODE;
            setTheme(isDark);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Use system preference if dark
            setTheme(true);
        } else {
            // Default to light
            setTheme(false);
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        const isDark = body.classList.contains(DARK_MODE);
        setTheme(!isDark);
    }
    
    // Add click event listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTheme();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            themeToggleBtn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    } else {
        console.error('Theme toggle button not found');
    }
    
    // Initialize theme on load
    initTheme();
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(USER_PREF_KEY)) {
                setTheme(e.matches);
            }
        });
    }
}); 