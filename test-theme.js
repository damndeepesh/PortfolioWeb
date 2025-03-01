// Simple test script to check theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Test script loaded');
    
    // Get theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    
    if (themeToggleBtn) {
        console.log('Theme toggle button found');
        
        // Log current theme
        console.log('Current theme:', body.classList.contains('light-mode') ? 'light' : 'dark');
        
        // Add test click handler
        themeToggleBtn.addEventListener('click', () => {
            console.log('Theme toggle button clicked');
            console.log('Before toggle - classList:', body.className);
            
            // Toggle theme
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                console.log('Switched to dark mode');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                console.log('Switched to light mode');
            }
            
            console.log('After toggle - classList:', body.className);
            
            // Check CSS variables
            const computedStyle = getComputedStyle(document.documentElement);
            console.log('--bg:', computedStyle.getPropertyValue('--bg'));
            console.log('--text:', computedStyle.getPropertyValue('--text'));
        });
        
        // Add visual indicator
        const indicator = document.createElement('div');
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.left = '10px';
        indicator.style.padding = '5px';
        indicator.style.background = 'rgba(0,0,0,0.7)';
        indicator.style.color = 'white';
        indicator.style.fontSize = '12px';
        indicator.style.zIndex = '9999';
        indicator.textContent = 'Theme Test Active';
        document.body.appendChild(indicator);
    } else {
        console.error('Theme toggle button not found');
    }
});
