(function () {
  'use strict';

  /* ---- THEME TOGGLE ---- */

  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');

  function updateLabel() {
    themeToggle.textContent = root.getAttribute('data-theme') === 'dark' ? 'LIGHT' : 'DARK';
  }

  themeToggle.addEventListener('click', function () {
    var isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    updateLabel();
  });

  updateLabel();

  /* ---- SCROLL REVEAL ---- */

  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('reveal--visible'); });
  }

})();
