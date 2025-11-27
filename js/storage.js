// js/storage.js - Theme and storage functionality
document.addEventListener('DOMContentLoaded', () => {
  // Dark Mode Toggle - Only add if button doesn't exist
  if (!document.getElementById('theme-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle Dark Mode';
    toggleBtn.id = 'theme-toggle';
    toggleBtn.style.margin = '10px';
    toggleBtn.style.padding = '8px 16px';
    document.body.insertBefore(toggleBtn, document.querySelector('footer'));
  }

  // Load saved theme - Use consistent key 'darkMode'
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
  }

  // Theme toggle event listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('darkMode', isDark);
      
      // Update button text
      themeToggle.textContent = isDark ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    });
    
    // Set initial button text
    if (document.body.classList.contains('dark-mode')) {
      themeToggle.textContent = 'Toggle Light Mode';
    }
  }
});