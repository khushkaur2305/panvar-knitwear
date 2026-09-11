/* ==========================================================================
   PANWAR KNITWEAR — script.js
   --------------------------------------------------------------------------
   Vanilla JS, no dependencies. Each concern is one small function:
     1.  syncHeaderHeight()   keeps the --header-h token accurate
     2.  initMobileNav()      hamburger menu open/close
     3.  initHeaderScroll()   hairline + shadow on the header once scrolled
     4.  initScrollReveal()   fade-up sections as they enter the viewport
     5.  initActiveNav()      underlines the section you are looking at
     6.  initFeaturedRail()   prev/next buttons for the featured product rail
     7.  initImageFallback()  styled placeholder if a photo fails to load
     8.  setFooterYear()      keeps the copyright line current

   There is no enquiry form: every call and WhatsApp action is a plain
   href in index.html, so there is nothing here to validate or submit.
   ========================================================================== */

(function () {
  'use strict';

  /** Desktop breakpoint — must match the 900px breakpoint in style.css. */
  var DESKTOP = window.matchMedia('(min-width: 900px)');
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
     A plain geometry check on scroll: anything whose top edge has crossed
     into the viewport gets `.is-visible` and is dropped from the queue.

     This is deliberately not IntersectionObserver. An offscreen or
     throttled tab can leave the observer silent after its initial
     callback, which would hide every section for the whole session —
     content must never be able to stay invisible.

     `.js-reveal` is only added once this function runs, so if JS is
     disabled or fails the content simply shows with no animation.
     ==================================================================== */
  function initScrollReveal() {
    var pending = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!pending.length || REDUCED_MOTION.matches) return;

    document.documentElement.classList.add('js-reveal');

    function update() {
      var limit = window.innerHeight * 0.92;

      pending = pending.filter(function (el) {
        if (el.getBoundingClientRect().top > limit) return true;   // still below
        el.classList.add('is-visible');
        return false;                                              // done with it
      });

      if (!pending.length) stop();
    }

    function stop() {
      window.clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    var onScroll = throttle(update);

    /* The interval is the guarantee. Scroll events and rAF are both
       throttled or suspended in offscreen and backgrounded tabs, so a
       purely event-driven reveal can strand a section at opacity 0 with
       no way to recover. A quarter-second poll costs nothing, stops as
       soon as the last item has been revealed, and means the worst case
       is a late fade rather than invisible content. */
    var timer = window.setInterval(update, 250);

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
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
     6. FEATURED PRODUCT RAIL
     The rail scrolls natively (swipe / trackpad / keyboard). These
     buttons just move it by one card for mouse users.
     ==================================================================== */
  function initFeaturedRail() {
    var rail = document.getElementById('featuredRail');
    var prev = document.getElementById('railPrev');
    var next = document.getElementById('railNext');
    if (!rail || !prev || !next) return;

    /** Width of one card plus the gap between cards. */
    function stride() {
      var card = rail.querySelector('.feature');
      if (!card) return rail.clientWidth;

      var track = card.parentElement;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    }

    function scrollBy(direction) {
      rail.scrollBy({
        left: stride() * direction,
        behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth'
      });
    }

    prev.addEventListener('click', function () { scrollBy(-1); });
    next.addEventListener('click', function () { scrollBy(1); });

    // Grey out a button when the rail can go no further that way.
    function updateButtons() {
      var max = rail.scrollWidth - rail.clientWidth - 1;
      prev.disabled = rail.scrollLeft <= 0;
      next.disabled = rail.scrollLeft >= max;
    }

    updateButtons();
    rail.addEventListener('scroll', throttle(updateButtons), { passive: true });
    window.addEventListener('resize', throttle(updateButtons));
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

  /**
   * Runs `fn` at most once per animation frame.
   *
   * A timer races the frame callback because browsers suspend
   * requestAnimationFrame in backgrounded and offscreen tabs — without the
   * fallback, scroll-driven state (reveals, header, active nav) would stop
   * updating there and never recover. Whichever fires first wins; the
   * `queued` flag makes the loser a no-op.
   */
  function throttle(fn) {
    var queued = false;

    function run() {
      if (!queued) return;
      queued = false;
      fn();
    }

    return function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(run);
      window.setTimeout(run, 100);
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
    initFeaturedRail();
    initImageFallback();
    setFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
