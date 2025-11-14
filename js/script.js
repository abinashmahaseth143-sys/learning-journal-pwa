document.addEventListener('DOMContentLoaded', () => {
  // Reusable Navigation Menu
  const navHTML = `
    <nav class="navbar">
      <a href="index.html" class="logo">My Journal</a>
      <ul class="nav-links">
        <li><a href="index.html" ${location.pathname.includes('index.html') ? 'class="active"' : ''}>Home</a></li>
        <li><a href="journal.html" ${location.pathname.includes('journal.html') ? 'class="active"' : ''}>Journal</a></li>
        <li><a href="projects.html" ${location.pathname.includes('projects.html') ? 'class="active"' : ''}>Projects</a></li>
        <li><a href="about.html" ${location.pathname.includes('about.html') ? 'class="active"' : ''}>About</a></li>
      </ul>
    </nav>`;

  // Live Date on Home Page
  if (location.pathname.includes('index.html')) {
    const dateEl = document.createElement('p');
    dateEl.id = 'live-date';
    document.querySelector('.hero').appendChild(dateEl);
    updateDate();
    setInterval(updateDate, 1000);
  }

  // Helper function for date
  function updateDate() {
    const now = new Date();
    if (document.getElementById('live-date')) {
      document.getElementById('live-date').textContent = 
        now.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }

  // Dark Mode Toggle
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = 'Toggle Dark Mode';
  toggleBtn.id = 'theme-toggle';
  document.body.appendChild(toggleBtn);

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Collapsible Journal Entries (Updated for JSON entries)
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
    document.querySelectorAll('.json-entry').forEach(article => {
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

  // Initialize collapsibles on page load
  initializeCollapsibles();

  // Form Validation
  if (location.pathname.includes('journal.html')) {
    const form = document.getElementById('journal-form');
    const textarea = document.getElementById('journal-text');
    const wordCount = document.getElementById('word-count');
    const errorMsg = document.getElementById('error-message');
    
    if (textarea) {
      textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).length;
        wordCount.textContent = `Words: ${words}`;
      });
    }
    
    if (form) {
      form.addEventListener('submit', (e) => {
        const words = textarea.value.trim().split(/\s+/).length;
        if (words < 10) {
          e.preventDefault();
          errorMsg.style.display = 'block';
        } else {
          errorMsg.style.display = 'none';
          alert('Submitted!');
          textarea.value = '';
        }
      });
    }

    // Re-initialize collapsibles when JSON entries are loaded
    const observer = new MutationObserver(() => {
      initializeCollapsibles();
    });

    const jsonEntriesContainer = document.getElementById('json-entries');
    if (jsonEntriesContainer) {
      observer.observe(jsonEntriesContainer, { childList: true, subtree: true });
    }
  }

  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) {
    placeholder.innerHTML = navHTML;
  }
});