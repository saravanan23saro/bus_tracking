/**
 * Bus Tracker — global bus-themed page loader
 * Public API: BusLoader.show(msg), hide(), setMessage(msg), wrap(asyncFn, msg)
 */
(function () {
  'use strict';

  const MIN_SHOW_MS = 1100;
  const NAV_DELAY_MS = 900;
  let showTime = 0;
  let hideTimer = null;
  let navigating = false;

  const LOADER_HTML =
    '<div id="bt-loader" aria-live="polite" aria-busy="true">' +
    '  <div class="bt-scene">' +
    '    <div class="bt-sun"></div>' +
    '    <div class="bt-cloud bt-cloud-1"></div>' +
    '    <div class="bt-cloud bt-cloud-2"></div>' +
    '    <div class="bt-road"><div class="bt-lane"></div></div>' +
    '    <div class="bt-exhaust"></div><div class="bt-exhaust"></div><div class="bt-exhaust"></div>' +
    '    <div class="bt-bus-wrap">' +
    '      <svg class="bt-bus-svg" viewBox="0 0 80 48" xmlns="http://www.w3.org/2000/svg">' +
    '        <rect x="8" y="12" width="56" height="28" rx="6" fill="#2563EB"/>' +
    '        <rect x="14" y="16" width="18" height="12" rx="2" fill="#EFF6FF" opacity="0.9"/>' +
    '        <rect x="36" y="16" width="18" height="12" rx="2" fill="#EFF6FF" opacity="0.9"/>' +
    '        <rect x="58" y="18" width="8" height="16" rx="2" fill="#FACC15"/>' +
    '        <circle class="bt-wheel" cx="22" cy="40" r="7" fill="#1E293B"/>' +
    '        <circle class="bt-wheel" cx="54" cy="40" r="7" fill="#1E293B"/>' +
    '        <circle cx="22" cy="40" r="3" fill="#94A3B8"/>' +
    '        <circle cx="54" cy="40" r="3" fill="#94A3B8"/>' +
    '      </svg>' +
    '    </div>' +
    '  </div>' +
    '  <div class="bt-progress"><div class="bt-fill"></div></div>' +
    '  <p class="bt-msg">Loading…</p>' +
    '  <div class="bt-dots"><span class="bt-dot"></span><span class="bt-dot"></span><span class="bt-dot"></span></div>' +
    '</div>';

  function getEl() {
    return document.getElementById('bt-loader');
  }

  function inject() {
    if (getEl()) return;
    document.body.insertAdjacentHTML('afterbegin', LOADER_HTML);
  }

  function setMessage(msg) {
    const el = getEl();
    if (!el) return;
    const msgEl = el.querySelector('.bt-msg');
    if (!msgEl) return;
    msgEl.classList.add('bt-fade');
    setTimeout(function () {
      msgEl.textContent = msg || 'Loading…';
      msgEl.classList.remove('bt-fade');
    }, 120);
  }

  function show(msg) {
    inject();
    const el = getEl();
    if (!el) return;
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    setMessage(msg || 'Loading…');
    el.classList.add('bt-visible');
    el.setAttribute('aria-busy', 'true');
    showTime = Date.now();
  }

  function hide() {
    const el = getEl();
    if (!el) return;
    const elapsed = Date.now() - showTime;
    const wait = Math.max(0, MIN_SHOW_MS - elapsed);

    function doHide() {
      el.classList.remove('bt-visible');
      el.setAttribute('aria-busy', 'false');
      document.documentElement.classList.add('bt-page-ready');
    }

    if (showTime && elapsed < MIN_SHOW_MS) {
      hideTimer = setTimeout(doHide, wait);
    } else {
      doHide();
    }
  }

  function isInternalLink(anchor) {
    if (!anchor || anchor.target === '_blank') return false;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    try {
      const url = new URL(href, window.location.href);
      return url.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  function bindNavigation() {
    document.addEventListener('click', function (e) {
      const a = e.target.closest('a[href]');
      if (!a || !isInternalLink(a) || navigating) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigating = true;
      show('Navigating…');
      setTimeout(function () {
        window.location.href = a.href;
      }, NAV_DELAY_MS);
    });

    document.addEventListener('submit', function (e) {
      if (navigating) return;
      const form = e.target;
      if (!form || form.target === '_blank') return;
      const action = form.getAttribute('action');
      if (action) {
        try {
          const url = new URL(action, window.location.href);
          if (url.origin !== window.location.origin) return;
        } catch (err) {
          return;
        }
      }
      show('Loading…');
    });
  }

  async function wrap(asyncFn, msg) {
    show(msg || 'Loading…');
    try {
      return await asyncFn();
    } finally {
      hide();
    }
  }

  window.BusLoader = {
    show: show,
    hide: hide,
    setMessage: setMessage,
    wrap: wrap
  };

  function onReady() {
    inject();
    bindNavigation();
    if (window._btSkipAutoShow) {
      document.documentElement.classList.add('bt-page-ready');
      return;
    }
    show('Loading page…');
    window.addEventListener('load', function () {
      hide();
    });
    if (document.readyState === 'complete') {
      hide();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
