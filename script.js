(function () {
  'use strict';

  /* ============================================
     Portfolio — Shadab Riyaz Tango
     Single-Page Script
     ============================================ */


  /* ---- SPLIT LETTER ANIMATION ---- */

  var NAME_LINES = ['Shadab', 'Riyaz Tango'];
  var START_DELAY_MS = 1400;
  var STAGGER_MS = 50;

  var nameContainer = document.getElementById('name-container');
  var roleEl = document.getElementById('role');
  var bioEl = document.getElementById('bio');

  function renderLetters() {
    var html = '';
    var index = 0;
    NAME_LINES.forEach(function (line, lineIdx) {
      for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        var delay = START_DELAY_MS + index * STAGGER_MS;
        if (ch === ' ') {
          html += ' ';
        } else {
          html += '<span class="letter" style="animation-delay:' + delay + 'ms">' + ch + '</span>';
        }
        index++;
      }
      if (lineIdx < NAME_LINES.length - 1) {
        html += '<br>';
      }
    });
    nameContainer.innerHTML = html;

    var totalTime = START_DELAY_MS + index * STAGGER_MS + 500;
    setTimeout(function () {
      roleEl.classList.add('role--visible');
    }, totalTime);
    setTimeout(function () {
      bioEl.classList.add('bio--visible');
    }, totalTime + 300);
  }

  renderLetters();

  /* ---- CUSTOM CURSOR + GLOW ---- */

  var cursorGlow = document.getElementById('cursor-glow');
  var cursor = document.getElementById('custom-cursor');
  var cursorX = 0;
  var cursorY = 0;
  var currentX = 0;
  var currentY = 0;
  var glowX = 0;
  var glowY = 0;

  document.addEventListener('mousemove', function (e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (!cursorGlow.classList.contains('cursor-glow--visible')) {
      cursorGlow.classList.add('cursor-glow--visible');
    }
  });

  function animateCursor() {
    currentX += (cursorX - currentX) * 0.45;
    currentY += (cursorY - currentY) * 0.45;
    cursor.style.left = currentX + 'px';
    cursor.style.top = currentY + 'px';

    glowX += (cursorX - glowX) * 0.08;
    glowY += (cursorY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  var hoverTargets = document.querySelectorAll('a, button, .photo-frame, .scroll-indicator');
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      cursor.classList.add('custom-cursor--hover');
    });
    el.addEventListener('mouseleave', function () {
      cursor.classList.remove('custom-cursor--hover');
    });
  });

  /* ---- INTERSECTION OBSERVER — SCROLL REVEAL ---- */

  var revealElements = document.querySelectorAll('.reveal');

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  var footerEl = document.getElementById('footer');

  /* ---- SCROLL PROGRESS BAR ---- */

  var scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  /* ---- PHOTO PARALLAX ---- */

  var heroPhoto = document.getElementById('hero-photo');

  function handleParallax() {
    if (heroPhoto && window.scrollY < window.innerHeight) {
      heroPhoto.style.transform = 'translateY(' + (window.scrollY * 0.12) + 'px)';
    }
  }

  window.addEventListener('scroll', handleParallax, { passive: true });

  /* ---- MAGNETIC HOVER ---- */

  document.querySelectorAll('.magnetic').forEach(function (link) {
    link.addEventListener('mousemove', function (e) {
      var rect = link.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      link.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
    });
    link.addEventListener('mouseleave', function () {
      link.style.transform = 'translate(0, 0)';
    });
  });

  /* ---- DARK MODE TOGGLE ---- */

  var themeToggle = document.getElementById('theme-toggle');

  themeToggle.addEventListener('click', function () {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  /* ---- SCROLL INDICATOR CLICK ---- */

  var scrollIndicator = document.getElementById('scroll-indicator');

  if (scrollIndicator && footerEl) {
    scrollIndicator.addEventListener('click', function () {
      footerEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

})();
