/**
 * Centered modal notifications — BusNotify.show(type, message)
 * Types: success | warning | error | info
 */
(function () {
  'use strict';

  const ICONS = {
    success: '✔',
    warning: '⚠',
    error: '✖',
    info: 'ℹ'
  };

  const TITLES = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info'
  };

  let root = null;
  let autoTimer = null;

  function ensureRoot() {
    if (root) return root;
    root = document.createElement('div');
    root.id = 'bus-notify-root';
    root.className = 'bus-notify-root';
    root.setAttribute('aria-live', 'polite');
    document.body.appendChild(root);
    return root;
  }

  function closeModal() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
    const el = document.querySelector('.bus-notify-modal');
    if (!el) return;
    el.classList.add('bus-notify-modal--out');
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
      const backdrop = document.querySelector('.bus-notify-backdrop');
      if (backdrop) backdrop.remove();
    }, 220);
  }

  function show(type, message, options) {
    options = options || {};
    const validType = ICONS[type] ? type : 'info';
    const duration = options.duration !== undefined ? options.duration : 5000;

    closeModal();
    ensureRoot();

    const backdrop = document.createElement('div');
    backdrop.className = 'bus-notify-backdrop';
    backdrop.addEventListener('click', closeModal);

    const modal = document.createElement('div');
    modal.className = 'bus-notify-modal bus-notify-modal--' + validType;
    modal.setAttribute('role', 'alertdialog');
    modal.setAttribute('aria-labelledby', 'bus-notify-title');

    modal.innerHTML =
      '<button type="button" class="bus-notify-close" aria-label="Close">&times;</button>' +
      '<div class="bus-notify-icon" aria-hidden="true">' + ICONS[validType] + '</div>' +
      '<h2 id="bus-notify-title" class="bus-notify-title">' + TITLES[validType] + '</h2>' +
      '<p class="bus-notify-message"></p>';

    modal.querySelector('.bus-notify-message').textContent = message;
    modal.querySelector('.bus-notify-close').addEventListener('click', closeModal);

    root.appendChild(backdrop);
    root.appendChild(modal);

    requestAnimationFrame(() => {
      backdrop.classList.add('is-visible');
      modal.classList.add('is-visible');
    });

    if (duration > 0) {
      autoTimer = setTimeout(closeModal, duration);
    }

    return { close: closeModal };
  }

  window.BusNotify = {
    show: show,
    success: function (msg, opts) { return show('success', msg, opts); },
    warning: function (msg, opts) { return show('warning', msg, opts); },
    error: function (msg, opts) { return show('error', msg, opts); },
    info: function (msg, opts) { return show('info', msg, opts); },
    close: closeModal
  };
})();
