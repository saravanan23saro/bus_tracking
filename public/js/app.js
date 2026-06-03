/**
 * Shared dashboard utilities — theme, header, map skeleton
 */
(function () {
  'use strict';

  function initTheme() {
    const isDark = localStorage.getItem('busTracker.darkMode') === 'true';
    document.documentElement.classList.toggle('dark-mode', isDark);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isDark ? 'Light mode' : 'Dark mode');
    }
  }

  function toggleTheme() {
    const isDark = !document.documentElement.classList.contains('dark-mode');
    document.documentElement.classList.toggle('dark-mode', isDark);
    localStorage.setItem('busTracker.darkMode', isDark);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isDark ? 'Light mode' : 'Dark mode');
    }
  }

  function initUserHeader() {
    const name = localStorage.getItem('busTracker.name') || 'User';
    const role = localStorage.getItem('busTracker.role') || 'user';
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');
    const roleEl = document.getElementById('userRole');
    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = (name.charAt(0) || 'U').toUpperCase();
    if (roleEl) roleEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);
  }

  function initLogout() {
    const btn = document.getElementById('logoutBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      localStorage.removeItem('busTracker.role');
      localStorage.removeItem('busTracker.busId');
      localStorage.removeItem('busTracker.name');
      if (window.BusLoader) window.BusLoader.show('Signing out…');
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 600);
    });
  }

  function hideMapSkeleton(mapId) {
    mapId = mapId || 'map';
    const card = document.querySelector('[data-map-card="' + mapId + '"]');
    if (card) card.classList.add('map-ready');
  }

  function checkSecureOrigin() {
    const banner = document.getElementById('httpsWarning');
    if (!banner) return true;
    const ok =
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1';
    banner.hidden = ok;
    return ok;
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(function () {});
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initUserHeader();
    initLogout();
    checkSecureOrigin();
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    registerServiceWorker();
  });

  window.BusApp = {
    initTheme: initTheme,
    toggleTheme: toggleTheme,
    hideMapSkeleton: hideMapSkeleton,
    checkSecureOrigin: checkSecureOrigin
  };
})();
