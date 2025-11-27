document.addEventListener('DOMContentLoaded', () => {
  // Insert navigation FIRST before anything else
  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) {
    const navHTML = `
      <nav class="navbar">
        <a href="index.html" class="logo">My Journal</a>
        <ul class="nav-links">
          <li><a href="index.html" ${window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') ? 'class="active"' : ''}> Home</a></li>
          <li><a href="journal.html" ${window.location.pathname.includes('journal.html') ? 'class="active"' : ''}> Journal</a></li>
          <li><a href="projects.html" ${window.location.pathname.includes('projects.html') ? 'class="active"' : ''}> Projects</a></li>
          <li><a href="about.html" ${window.location.pathname.includes('about.html') ? 'class="active"' : ''}> About</a></li>
        </ul>
      </nav>`;
    placeholder.innerHTML = navHTML;
  }

  // Live Date on Home Page
  if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    const dateEl = document.createElement('p');
    dateEl.id = 'live-date';
    dateEl.style.textAlign = 'center';
    dateEl.style.marginTop = '10px';
    dateEl.style.fontWeight = 'bold';
    
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.appendChild(dateEl);
      updateDate();
      setInterval(updateDate, 1000);
    }
  }

  // Helper function for date
  function updateDate() {
    const now = new Date();
    const dateEl = document.getElementById('live-date');
    if (dateEl) {
      dateEl.textContent = 
        now.toLocaleString('en-GB', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        });
    }
  }

  // Dark Mode Toggle - Only add if button doesn't exist
  if (!document.getElementById('theme-toggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle Dark Mode';
    toggleBtn.id = 'theme-toggle';
    toggleBtn.style.margin = '10px';
    toggleBtn.style.padding = '8px 16px';
    document.body.insertBefore(toggleBtn, document.querySelector('footer'));
  }

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  // Theme toggle event listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Collapsible Journal Entries
  function initializeCollapsibles() {
    // For hard-coded weekly entries
    document.querySelectorAll('.journal article').forEach(article => {
      const h2 = article.querySelector('h2');
      if (h2 && !h2.classList.contains('collapsible-initialized')) {
        h2.style.cursor = 'pointer';
        h2.classList.add('collapsible-initialized');
        h2.addEventListener('click', () => {
          article.classList.toggle('collapsed');
        });
      }
    });

    // For dynamically loaded JSON entries
    document.querySelectorAll('#json-entries article').forEach(article => {
      const h2 = article.querySelector('h2');
      if (h2 && !h2.classList.contains('collapsible-initialized')) {
        h2.style.cursor = 'pointer';
        h2.classList.add('collapsible-initialized');
        h2.addEventListener('click', () => {
          article.classList.toggle('collapsed');
        });
      }
    });
  }

  // Initialize collapsibles
  initializeCollapsibles();

  // Form Validation - Only on journal page
  if (window.location.pathname.includes('journal.html')) {
    const form = document.getElementById('journal-form');
    const textarea = document.getElementById('journal-text');
    const wordCount = document.getElementById('word-count');
    const errorMsg = document.getElementById('error-message');
    
    if (textarea && wordCount) {
      textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
        wordCount.textContent = `Words: ${words}`;
        
        // Hide error message when typing
        if (errorMsg) {
          errorMsg.style.display = 'none';
        }
      });
    }
    
    if (form && textarea && errorMsg) {
      form.addEventListener('submit', (e) => {
        const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
        if (words < 10) {
          e.preventDefault();
          errorMsg.style.display = 'block';
        } else {
          errorMsg.style.display = 'none';
          alert('Journal entry submitted successfully!');
          // Don't clear the textarea to allow manual saving
        }
      });
    }

    // Re-initialize collapsibles when JSON entries are loaded
    const jsonEntriesContainer = document.getElementById('json-entries');
    if (jsonEntriesContainer) {
      const observer = new MutationObserver(() => {
        setTimeout(initializeCollapsibles, 100);
      });
      observer.observe(jsonEntriesContainer, { childList: true, subtree: true });
    }
  }
});