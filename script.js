/* ==========================================================================
   THE DAILY CRUMB — script.js
   --------------------------------------------------------------------------
   Vanilla JS, no dependencies. Each concern is one small function:
     1.  syncHeaderHeight()  keeps the --header-h token accurate
     2.  initMobileNav()     hamburger menu open/close
     3.  initHeaderScroll()  compact/shadowed header once scrolled
     4.  initScrollReveal()  fade-up sections as they enter the viewport
     5.  initActiveNav()     highlights the section you are looking at
     6.  initEnquiryForm()   validates, then opens WhatsApp pre-filled
     7.  initImageFallback() graceful placeholder if a photo fails to load
     8.  setFooterYear()     keeps the copyright line current

   BUSINESS DETAILS: the WhatsApp number lives in WHATSAPP_NUMBER below.
   Every other phone/WhatsApp link is a plain href in index.html.
   ========================================================================== */

(function () {
  'use strict';

  /* ---- Configuration -------------------------------------------------- */

  /** Digits only, including country code — no +, spaces or dashes. */
  var WHATSAPP_NUMBER = '919876543210';

  /** Business name used in the generated WhatsApp message. */
  var BUSINESS_NAME = 'The Daily Crumb';

  /** Desktop breakpoint — must match the 900px breakpoint in style.css. */
  var DESKTOP_QUERY = '(min-width: 900px)';

  var DESKTOP = window.matchMedia(DESKTOP_QUERY);
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');


  /* ====================================================================
     1. HEADER HEIGHT
     The sticky header overlaps anchor targets. CSS uses --header-h in
     `scroll-padding-top`, so keep the token equal to the real height.
     ==================================================================== */
  function syncHeaderHeight() {
    var header = document.getElementById('header');
    if (!header) return;

    var apply = function () {
      document.documentElement.style.setProperty(
        '--header-h', header.offsetHeight + 'px'
      );
    };

    apply();
    window.addEventListener('resize', throttle(apply));
    window.addEventListener('orientationchange', apply);
  }


  /* ====================================================================
     2. MOBILE NAVIGATION
     ==================================================================== */
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    var isOpen = function () {
      return toggle.getAttribute('aria-expanded') === 'true';
    };

    function open() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';   // stop background scrolling
    }

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) { close(); } else { open(); }
    });

    // Close after choosing a destination (the browser handles the scroll).
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a') && isOpen()) close();
    });

    // Close on Escape, returning focus to the button.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        close();
        toggle.focus();
      }
    });

    // Close when tapping outside the panel.
    document.addEventListener('click', function (event) {
      if (!isOpen()) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
    });

    // Reset state if the viewport grows to desktop while the panel is open.
    addMediaListener(DESKTOP, function (matches) {
      if (matches && isOpen()) close();
    });
  }


  /* ====================================================================
     3. STICKY HEADER STATE
     ==================================================================== */
  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };

    update();
    window.addEventListener('scroll', throttle(update), { passive: true });
  }


  /* ====================================================================
     4. SCROLL REVEAL
     `.js-reveal` is only added when IntersectionObserver exists, so if JS
     is unavailable the content simply shows with no animation.
     ==================================================================== */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window) || REDUCED_MOTION.matches) return;

    document.documentElement.classList.add('js-reveal');

    var reported = false;

    var observer = new IntersectionObserver(function (entries) {
      reported = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);      // reveal once, then stop watching
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (item) { observer.observe(item); });

    /* Safety net: a few environments (background tabs, embedded previews,
       pages that never composite) never fire the observer. Dropping
       `js-reveal` shows everything, so content can never stay invisible. */
    window.setTimeout(function () {
      if (!reported) document.documentElement.classList.remove('js-reveal');
    }, 1500);
  }


  /* ====================================================================
     5. ACTIVE NAV LINK
     Marks the nav link whose section is currently in view.
     ==================================================================== */
  function initActiveNav() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav__link[href^="#"]')
    );
    if (!links.length) return;

    // Pair each link with its section, skipping any dead anchors.
    var targets = links.map(function (link) {
      return { link: link, section: document.querySelector(link.hash) };
    }).filter(function (pair) { return pair.section; });

    if (!targets.length) return;

    function update() {
      var offset = (document.getElementById('header') || {}).offsetHeight || 0;
      var probe = window.scrollY + offset + 24;
      var current = targets[0];

      targets.forEach(function (pair) {
        if (pair.section.offsetTop <= probe) current = pair;
      });

      // Last section wins when the page is scrolled to the very bottom.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = targets[targets.length - 1];
      }

      targets.forEach(function (pair) {
        pair.link.classList.toggle('is-active', pair === current);
      });
    }

    update();
    window.addEventListener('scroll', throttle(update), { passive: true });
    window.addEventListener('resize', throttle(update));
  }


  /* ====================================================================
     6. ENQUIRY FORM → WHATSAPP
     There is no backend. We validate, build a readable message and hand
     it to WhatsApp so the customer only has to press send.
     ==================================================================== */
  function initEnquiryForm() {
    var form = document.getElementById('enquiryForm');
    if (!form) return;

    var status = document.getElementById('formStatus');

    var fields = {
      name:    { input: form.querySelector('#name'),    error: form.querySelector('#nameError') },
      phone:   { input: form.querySelector('#phone'),   error: form.querySelector('#phoneError') },
      order:   { input: form.querySelector('#order'),   error: form.querySelector('#orderError') },
      message: { input: form.querySelector('#message'), error: null }
    };

    /* -- Validation rules ---------------------------------------------- */

    function validateName(value) {
      if (!value) return 'Please enter your name.';
      if (value.length < 2) return 'Please enter at least 2 characters.';
      return '';
    }

    /**
     * Accepts 10-digit Indian mobile numbers, with or without the +91
     * country code or a leading 0. Returns '' when valid.
     */
    function validatePhone(value) {
      if (!value) return 'Please enter your phone number.';
      var local = toLocalMobile(value);
      if (!/^[6-9]\d{9}$/.test(local)) {
        return 'Please enter a valid 10-digit mobile number.';
      }
      return '';
    }

    function validateOrder(value) {
      if (!value) return 'Please choose what you would like to order.';
      return '';
    }

    /** Strips formatting and the +91 / 0 prefixes down to 10 digits. */
    function toLocalMobile(value) {
      var digits = String(value).replace(/\D/g, '');
      if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
      if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.slice(1);
      return digits;
    }

    /* -- Error display ------------------------------------------------- */

    function setError(field, message) {
      if (!field.input) return;
      field.input.classList.toggle('has-error', Boolean(message));
      if (message) {
        field.input.setAttribute('aria-invalid', 'true');
      } else {
        field.input.removeAttribute('aria-invalid');
      }
      if (field.error) field.error.textContent = message || '';
    }

    function checkField(key) {
      var field = fields[key];
      if (!field || !field.input) return '';

      var value = field.input.value.trim();
      var message = '';

      if (key === 'name')  message = validateName(value);
      if (key === 'phone') message = validatePhone(value);
      if (key === 'order') message = validateOrder(value);

      setError(field, message);
      return message;
    }

    // Clear an error as soon as the customer fixes it — no nagging while typing.
    ['name', 'phone', 'order'].forEach(function (key) {
      var field = fields[key];
      if (!field.input) return;

      var revalidate = function () {
        if (field.input.classList.contains('has-error')) checkField(key);
      };

      field.input.addEventListener('input', revalidate);
      field.input.addEventListener('change', revalidate);
      field.input.addEventListener('blur', function () {
        if (field.input.value.trim()) checkField(key);
      });
    });

    /* -- Message builder ----------------------------------------------- */

    function buildMessage(data) {
      var sentence = 'Hello ' + BUSINESS_NAME + ', my name is ' + data.name +
                     '. I would like to enquire about ' + data.order + '.';

      if (data.message) sentence += ' ' + data.message;

      return sentence + '\n\nMy contact number: +91 ' + data.phone;
    }

    /* -- Submit -------------------------------------------------------- */

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (status) status.textContent = '';

      // Validate everything, then focus the first problem field.
      var problems = ['name', 'phone', 'order'].filter(function (key) {
        return checkField(key) !== '';
      });

      if (problems.length) {
        var first = fields[problems[0]].input;
        if (first) first.focus();
        return;
      }

      var text = buildMessage({
        name:    fields.name.input.value.trim(),
        phone:   toLocalMobile(fields.phone.input.value),
        order:   fields.order.input.value.trim(),
        message: fields.message.input ? fields.message.input.value.trim() : ''
      });

      var url = 'https://wa.me/' + WHATSAPP_NUMBER +
                '?text=' + encodeURIComponent(text);

      // Open in a new tab; fall back to same-tab if a popup blocker steps in.
      var opened = window.open(url, '_blank', 'noopener');
      if (!opened) window.location.href = url;

      if (status) {
        status.textContent =
          'Opening WhatsApp with your enquiry. If it did not open, please call ' +
          'us on +91 98765 43210 instead.';
      }
    });
  }


  /* ====================================================================
     7. IMAGE FALLBACK
     Photos are loaded from Unsplash. If one fails (offline, blocked, or a
     changed URL) we swap in a styled placeholder instead of a broken icon.
     ==================================================================== */
  function initImageFallback() {
    var images = document.querySelectorAll('img');

    Array.prototype.forEach.call(images, function (img) {
      img.addEventListener('error', function () { replaceWithPlaceholder(img); });

      // Catch images that already failed before this script ran.
      if (img.complete && img.naturalWidth === 0) replaceWithPlaceholder(img);
    });

    function replaceWithPlaceholder(img) {
      var holder = img.parentElement;
      if (!holder || holder.classList.contains('media-fallback')) return;

      holder.classList.add('media-fallback');
      holder.setAttribute(
        'data-fallback-label',
        img.getAttribute('alt') || 'Photo coming soon'
      );
      img.remove();
    }
  }


  /* ====================================================================
     8. FOOTER YEAR
     ==================================================================== */
  function setFooterYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }


  /* ====================================================================
     UTILITIES
     ==================================================================== */

  /** Runs `fn` at most once per animation frame. */
  function throttle(fn) {
    var queued = false;
    return function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        fn();
      });
    };
  }

  /** matchMedia listener that also works in older Safari. */
  function addMediaListener(mql, handler) {
    var wrapped = function (event) { handler(event.matches); };
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', wrapped);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(wrapped);
    }
  }


  /* ====================================================================
     BOOT
     ==================================================================== */
  function init() {
    syncHeaderHeight();
    initMobileNav();
    initHeaderScroll();
    initScrollReveal();
    initActiveNav();
    initEnquiryForm();
    initImageFallback();
    setFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
