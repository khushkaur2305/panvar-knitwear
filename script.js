/* ==========================================================================
   PANWAR KNITWEAR — script.js (dark studio edition)
   --------------------------------------------------------------------------
   Five small concerns, no dependencies:

     1.  measureBar()      keeps the --bar token equal to the real masthead
     2.  overlayMenu()     Menu / Close overlay on small screens
     3.  mastheadState()   solid background once the hero has scrolled past
     4.  settleIn()        fades sections in as they come into view
     5.  imageGuard()      styled placeholder if a photograph fails to load
     6.  stampYear()       keeps the copyright line current

   There is no form, no carousel and no active-section tracking, so there
   is nothing else for this file to do.
   ========================================================================== */

(function () {
  'use strict';

  /** Must match the 960px breakpoint used for the menu in style.css. */
  var WIDE = window.matchMedia('(min-width: 960px)');
  var STILL = window.matchMedia('(prefers-reduced-motion: reduce)');


  /* ====================================================================
     1. MASTHEAD HEIGHT
     The masthead is fixed, so anchor targets would slide under it. CSS
     uses --bar in `scroll-padding-top`; keep it truthful.
     ==================================================================== */
  function measureBar() {
    var bar = document.getElementById('masthead');
    if (!bar) return;

    var apply = function () {
      document.documentElement.style.setProperty('--bar', bar.offsetHeight + 'px');
    };

    apply();
    window.addEventListener('resize', pace(apply));
    window.addEventListener('orientationchange', apply);
  }


  /* ====================================================================
     2. OVERLAY MENU
     ==================================================================== */
  function overlayMenu() {
    var btn = document.getElementById('menuBtn');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;

    var isOpen = function () {
      return btn.getAttribute('aria-expanded') === 'true';
    };

    function open() {
      menu.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function shut() {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (isOpen()) { shut(); } else { open(); }
    });

    // Picking a destination closes the overlay; the browser does the scroll.
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a') && isOpen()) shut();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        shut();
        btn.focus();
      }
    });

    // The overlay only exists below 960px — drop it if the window grows.
    watchMedia(WIDE, function (wide) {
      if (wide && isOpen()) shut();
    });
  }


  /* ====================================================================
     3. MASTHEAD STATE
     Transparent over the hero photograph, solid once past it.
     ==================================================================== */
  function mastheadState() {
    var bar = document.getElementById('masthead');
    if (!bar) return;

    var update = function () {
      bar.classList.toggle('is-stuck', window.scrollY > 24);
    };

    update();
    window.addEventListener('scroll', pace(update), { passive: true });
  }


  /* ====================================================================
     4. SETTLE IN
     A geometry check, deliberately not IntersectionObserver: an offscreen
     or throttled tab can leave the observer silent after its first
     callback, which would strand whole sections at opacity 0 with no way
     back. Content must never be able to stay invisible.
     ==================================================================== */
  function settleIn() {
    var waiting = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!waiting.length || STILL.matches) return;

    document.documentElement.classList.add('js-reveal');

    function sweep() {
      var edge = window.innerHeight * 0.9;

      waiting = waiting.filter(function (el) {
        if (el.getBoundingClientRect().top > edge) return true;   // not yet
        el.classList.add('is-shown');
        return false;
      });

      if (!waiting.length) halt();
    }

    function halt() {
      window.clearInterval(ticker);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }

    var onScroll = pace(sweep);

    /* The interval is the guarantee. Scroll events and animation frames
       are both throttled in backgrounded tabs, so an event-only reveal
       can stall permanently. A quarter-second poll costs nothing and
       stops the moment the last item has settled. */
    var ticker = window.setInterval(sweep, 250);

    sweep();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }


  /* ====================================================================
     5. IMAGE GUARD
     Photographs come from a remote host. If one fails we show a labelled
     placeholder rather than a broken-image icon.
     ==================================================================== */
  function imageGuard() {
    Array.prototype.forEach.call(document.images, function (img) {
      img.addEventListener('error', function () { swap(img); });

      // Catch anything that already failed before this script ran.
      if (img.complete && img.naturalWidth === 0) swap(img);
    });

    function swap(img) {
      var holder = img.parentElement;
      if (!holder || holder.classList.contains('img-missing')) return;

      holder.classList.add('img-missing');
      holder.setAttribute('data-missing', img.getAttribute('alt') || 'Image unavailable');
      img.remove();
    }
  }


  /* ====================================================================
     6. FOOTER YEAR
     ==================================================================== */
  function stampYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }


  /* ====================================================================
     HELPERS
     ==================================================================== */

  /**
   * Runs `fn` at most once per frame.
   *
   * A timer races the frame callback because browsers suspend
   * requestAnimationFrame in backgrounded and offscreen tabs. Without the
   * fallback, scroll-driven state would stop updating there and never
   * recover. Whichever fires first wins; the flag makes the loser a no-op.
   */
  function pace(fn) {
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
  function watchMedia(mql, handler) {
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
  function start() {
    measureBar();
    overlayMenu();
    mastheadState();
    settleIn();
    imageGuard();
    stampYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

})();
