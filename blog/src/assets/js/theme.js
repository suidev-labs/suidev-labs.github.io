// Theme Toggle Functionality
(function() {
  const THEME_KEY = 'theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';

  // Get saved theme or detect system preference
  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK_THEME : LIGHT_THEME;
  }

  // Apply theme to document
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Initialize theme on page load
  function initTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);
  }

  // Toggle between themes
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    setTheme(newTheme);
  }

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initTheme();

    // Set up toggle button
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }

    // Set up mobile nav toggle
    const navToggle = document.getElementById('nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
      navToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
      });
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem(THEME_KEY)) {
      setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
    }
  });

  // Apply theme immediately (before DOM ready) to prevent flash
  initTheme();
})();
