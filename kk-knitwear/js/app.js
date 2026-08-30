/* ==========================================================================
   K.K KNITWEAR CLUB — app.js
   --------------------------------------------------------------------------
   Vanilla JS, no dependencies. Loaded on every page. Each concern is one
   small function:

      1.  icons()               inline SVG registry for JS-rendered markup
      2.  format helpers        price, specs, weave labels
      3.  syncHeaderHeight()    keeps the --header-h token accurate
      4.  initHeaderScroll()    compact/blurred header once scrolled
      5.  initMobileNav()       hamburger drawer, focus trap, Escape
      6.  initScrollReveal()    fade-up sections as they enter the viewport
      7.  initEnquiryList()     the B2B "quote basket" + its drawer
      8.  initEnquiryForm()     validates, then builds a WhatsApp message
                                and a copyable plain-text summary
      9.  initImageFallback()   a failed photo falls back to its swatch
     10.  fillDynamicLists()    category / application lists in nav + footer
     11.  initWhatsAppLinks()   every [data-wa] link, from ONE constant
     12.  setFooterYear()

   BUSINESS DETAILS
     The WhatsApp number lives in WHATSAPP_NUMBER below — change it in this
     one place and every WhatsApp button on the site follows. Plain phone
     links are ordinary `tel:` hrefs in the HTML.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var KK = window.KK;
  if (!KK) return;


  /* ---- Configuration --------------------------------------------------- */

  /**
   * Digits only, including country code — no +, spaces or dashes.
   * Seeded with the company's published number (079 4280 2251).
   * NOTE FOR THE CLIENT: confirm this line accepts WhatsApp; if the business
   * uses a different mobile for WhatsApp, replace the digits here only.
   */
  var WHATSAPP_NUMBER = '917942802251';

  var BUSINESS_NAME = 'K.K Knitwear Club';

  /** Desktop breakpoint — must match the 900px breakpoint in style.css. */
  var DESKTOP = window.matchMedia('(min-width: 900px)');
  var REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  var STORE_KEY = 'kk-enquiry-list-v1';

  KK.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
  KK.DESKTOP = DESKTOP;
  KK.REDUCED_MOTION = REDUCED_MOTION;


  /* ====================================================================
     1. ICONS
     A small registry so JS-rendered markup can use the same icon set as
     the hand-written HTML. 24x24, stroked, currentColor.
     ==================================================================== */

  var PATHS = {
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
    'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m20 6-11 11-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    'search-x': '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M9 9l4 4M13 9l-4 4"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    rows: '<rect x="3" y="4" width="18" height="5" rx="1"/><rect x="3" y="14" width="18" height="5" rx="1"/>',
    phone: '<path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 5.2 2 2 0 0 1 5.5 3z"/>',
    whatsapp: '<path d="M3.5 20.5 5 16a8 8 0 1 1 3 3z"/><path d="M9 10c0 3 2 5 5 5 1 0 1.5-1 1.5-1L14 13l-1 1c-1-.5-1.5-1-2-2l1-1-1-1.5S10 9 9 9c0 0-.5.5 0 1z"/>',
    'map-pin': '<path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    navigation: '<path d="m3 11 18-8-8 18-2-8z"/>',
    shield: '<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    bank: '<path d="m3 10 9-6 9 6"/><path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9M3 20h18"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    rupee: '<path d="M7 4h10M7 8.5h10M16 4c0 4-3.5 4.5-6.5 4.5H7l7 11.5"/>',
    scissors: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5 20 18M8 16.5 20 6"/>',
    truck: '<path d="M3 6h11v11H3z"/><path d="M14 9h4l3 3v5h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    factory: '<path d="M3 21V9l6 4V9l6 4V4h6v17z"/><path d="M3 21h18"/>',
    ruler: '<rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
    gauge: '<path d="M4.5 18a8.5 8.5 0 1 1 15 0"/><path d="M12 14.5 16 10"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.3-1.9-.8-1.1 0-2.1 1.2-2.1H17a4 4 0 0 0 4-4c0-5-4-10-9-10z"/><circle cx="8" cy="10" r="1.2"/><circle cx="12" cy="7.5" r="1.2"/><circle cx="16" cy="10" r="1.2"/>',
    shirt: '<path d="M8 3 4 5.5 6 10l2-1v11h8V9l2 1 2-4.5L16 3l-2 2h-4z"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    person: '<circle cx="12" cy="5" r="2.5"/><path d="M12 8v6M12 14l-3 7M12 14l3 7M8 10h8"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    sparkle: '<path d="M12 3 13.8 9 20 12l-6.2 3L12 21l-1.8-6L4 12l6.2-3z"/>',
    sofa: '<path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M2 13a2 2 0 0 1 4 0v3h12v-3a2 2 0 0 1 4 0v6H2z"/>',
    tent: '<path d="m12 4 9 16H3z"/><path d="M12 4v16M8 20l4-9 4 9"/>',
    quote: '<path d="M9 6c-3 0-5 2-5 5s2 4 4 4 3-1 3-3-1-3-3-3M20 6c-3 0-5 2-5 5s2 4 4 4 3-1 3-3-1-3-3-3"/>',
    trash: '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    send: '<path d="M21 3 3 10.5l7 3 3 7z"/><path d="m10 13.5 4-4"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5M12 16h.01"/>',
    package: '<path d="M4 8h16v12H4z"/><path d="M4 8 6 4h12l2 4M12 8v12M9 12h6"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1"/>',
    'file-text': '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4z"/>',
    'move-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
    store: '<path d="M4 9h16v11H4z"/><path d="m4 9 1.5-5h13L20 9M9 20v-6h6v6"/>',
    building: '<path d="M4 21V4h10v17M14 9h6v12"/><path d="M7 8h4M7 12h4M7 16h4M17 13h1M17 17h1"/>'
  };

  /**
   * @param {string} name key of PATHS
   * @param {string} [cls] extra class names
   * @returns {string} inline SVG markup
   */
  KK.icon = function (name, cls) {
    var d = PATHS[name];
    if (!d) return '';
    return '<svg class="icon ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  };


  /* ====================================================================
     2. FORMAT HELPERS
     Prices are the published "Approx." rates — always shown as indicative.
     ==================================================================== */

  KK.priceLabel = function (p) {
    if (typeof p.price !== 'number') return 'Price on request';
    return '≈ ₹' + p.price + ' / ' + p.unit.toLowerCase();
  };

  KK.priceValue = function (p) {
    return typeof p.price === 'number' ? '₹' + p.price : 'On request';
  };

  KK.priceUnit = function (p) {
    return typeof p.price === 'number' ? 'per ' + p.unit.toLowerCase() : '';
  };

  /** The two or three specs worth showing on a card, in a fixed order. */
  KK.keySpecs = function (p) {
    var out = [];
    if (p.gsm) out.push(['GSM', p.gsm]);
    if (p.width) out.push(['Width', p.width]);
    if (p.moq) out.push(['MOQ', p.moq]);
    return out;
  };

  /** Escapes text before it goes anywhere near innerHTML. */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  KK.esc = esc;

  KK.specChips = function (pairs) {
    return pairs.map(function (pair) {
      return '<span class="spec"><span class="spec__k">' + esc(pair[0]) +
        '</span><span class="spec__v">' + esc(pair[1]) + '</span></span>';
    }).join('');
  };


  /* ====================================================================
     2b. SHARED CARD MARKUP
     One renderer per card type, used by the homepage, the catalogue and
     the detail page, so a card can never look different in two places.
     ==================================================================== */

  /** The <img> for a product/category, preferring a real photo if present. */
  function mediaImg(item, alt) {
    var swatch = KK.swatchFor(item);
    var src = item.image || swatch;
    return '<img class="media__img" src="' + esc(src) + '" ' +
      'data-fallback="' + esc(swatch) + '" loading="lazy" decoding="async" ' +
      'alt="' + esc(alt) + '">';
  }
  KK.mediaImg = mediaImg;

  KK.productCardHtml = function (p) {
    var cat = KK.categoryBySlug[p.category];
    var alt = p.name + ' — ' + KK.weaveLabel(p.weave).toLowerCase() + ' construction swatch';
    return '<article class="product-card reveal">' +
      '<a class="media" href="fabric.html?p=' + esc(p.slug) + '" ' +
        'aria-label="' + esc(p.name) + ' — view specifications">' +
        mediaImg(p, alt) +
        '<span class="media__veil"></span><span class="media__ring"></span>' +
        '<span class="media__tags">' +
          '<span class="tag">' + esc(KK.weaveLabel(p.weave)) + '</span>' +
          (p.featured ? '<span class="tag tag--key">Key line</span>' : '') +
        '</span>' +
        '<span class="media__cat">' + esc(cat ? cat.name : '') + '</span>' +
      '</a>' +
      '<div class="product-card__body">' +
        '<h3 class="product-card__name"><a class="link-draw" href="fabric.html?p=' +
          esc(p.slug) + '">' + esc(p.name) + '</a></h3>' +
        (p.material ? '<p class="product-card__material">' + esc(p.material) + '</p>' : '') +
        '<div class="product-card__specs">' + KK.specChips(KK.keySpecs(p)) + '</div>' +
        '<div class="product-card__foot">' +
          '<div><p class="price">' + esc(KK.priceValue(p)) + '</p>' +
          (KK.priceUnit(p) ? '<p class="price__unit">' + esc(KK.priceUnit(p)) +
            ' · indicative</p>' : '') + '</div>' +
          addButton(p) +
        '</div>' +
      '</div>' +
    '</article>';
  };

  function addButton(p) {
    var listed = KK.enquiry.has(p.slug);
    return '<button type="button" class="add-btn" data-add="' + esc(p.slug) + '" ' +
      'aria-pressed="' + (listed ? 'true' : 'false') + '" ' +
      'aria-label="' + (listed ? 'Remove ' : 'Add ') + esc(p.name) +
      (listed ? ' from' : ' to') + ' enquiry list">' +
      '<span class="add-btn__off">' + KK.icon('plus') + 'Enquire</span>' +
      '<span class="add-btn__on">' + KK.icon('check') + 'Listed</span>' +
    '</button>';
  }
  KK.addButton = addButton;

  KK.productRowHtml = function (p) {
    var cat = KK.categoryBySlug[p.category];
    var pairs = [
      ['Material', p.material], ['GSM', p.gsm], ['Width', p.width],
      ['Pattern', p.pattern], ['Colour', p.color], ['MOQ', p.moq],
      ['Packing', p.packaging]
    ].filter(function (pair) { return pair[1]; });

    return '<article class="product-row reveal">' +
      '<a class="media" href="fabric.html?p=' + esc(p.slug) + '" tabindex="-1" aria-hidden="true">' +
        mediaImg(p, '') + '<span class="media__ring"></span>' +
      '</a>' +
      '<div>' +
        '<div class="product-row__head">' +
          '<span class="product-row__cat">' + esc(cat ? cat.name : '') + '</span>' +
          '<span class="marquee__dot"></span>' +
          '<span class="product-row__weave">' + esc(KK.weaveLabel(p.weave)) + '</span>' +
        '</div>' +
        '<h3><a class="link-draw" href="fabric.html?p=' + esc(p.slug) + '">' +
          esc(p.name) + '</a></h3>' +
        '<p class="product-row__blurb">' + esc(p.blurb) + '</p>' +
        '<div class="product-row__specs">' + KK.specChips(pairs) + '</div>' +
        (p.usage && p.usage.length
          ? '<p class="product-row__usage"><span class="mono">Used for </span>' +
            esc(p.usage.join(', ')) + '</p>' : '') +
      '</div>' +
      '<div class="product-row__buy">' +
        '<div><p class="price">' + esc(KK.priceValue(p)) + '</p>' +
        (KK.priceUnit(p) ? '<p class="price__unit">' + esc(KK.priceUnit(p)) +
          ' · indicative</p>' : '') +
        (p.sampleOrders ? '<p class="badge badge--loom" style="margin-top:.5rem">Samples</p>' : '') +
        '</div>' +
        '<div class="btn-row">' + addButton(p) +
          '<a class="icon-btn" href="fabric.html?p=' + esc(p.slug) + '" ' +
          'aria-label="Open ' + esc(p.name) + '">' + KK.icon('arrow-right') + '</a>' +
        '</div>' +
      '</div>' +
    '</article>';
  };

  KK.categoryTileHtml = function (c, feature) {
    return '<a class="cat-tile reveal' + (feature ? ' cat-tile--feature' : '') + '" ' +
      'href="fabrics.html?category=' + esc(c.slug) + '">' +
      '<span class="media">' +
        '<img class="media__img" src="' + KK.swatchFor(c) + '" loading="lazy" ' +
          'decoding="async" alt="' + esc(c.name) + ' — ' +
          esc(KK.weaveLabel(c.weave).toLowerCase()) + ' construction swatch">' +
        '<span class="media__veil"></span><span class="media__ring"></span>' +
        '<span class="cat-tile__body">' +
          '<span class="cat-tile__count">' + c.count +
            (c.count === 1 ? ' line' : ' lines') + '</span>' +
          '<span class="cat-tile__name">' + esc(c.name) + '</span>' +
          (feature ? '<span class="cat-tile__desc">' + esc(c.description) + '</span>' : '') +
        '</span>' +
        '<span class="cat-tile__go">' + KK.icon('arrow-up-right') + '</span>' +
      '</span>' +
      (feature ? '' : '<span class="cat-tile__foot">' + esc(c.description) + '</span>') +
    '</a>';
  };


  /* ====================================================================
     3. HEADER HEIGHT
     The sticky header overlaps anchor targets. CSS uses --header-h in
     `scroll-padding-top`, so keep the token equal to the real height.
     ==================================================================== */

  function syncHeaderHeight() {
    var header = document.querySelector('.header');
    if (!header) return;
    var apply = function () {
      document.documentElement.style.setProperty(
        '--header-h', header.offsetHeight + 'px'
      );
    };
    apply();
    window.addEventListener('resize', apply);
  }


  /* ====================================================================
     4. HEADER SCROLL STATE
     ==================================================================== */

  function initHeaderScroll() {
    var header = document.querySelector('.header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ====================================================================
     5. DRAWERS (mobile nav, enquiry list, mobile filters)
     One implementation: scroll lock, Escape, backdrop click, focus trap.
     ==================================================================== */

  var openDrawer = null;
  var lastFocused = null;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function lockScroll(on) {
    if (on) {
      var gap = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (gap > 0) document.body.style.paddingRight = gap + 'px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }

  KK.openDrawer = function (drawer) {
    if (!drawer) return;
    if (openDrawer && openDrawer !== drawer) KK.closeDrawer();
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    drawer.removeAttribute('aria-hidden');
    var scrim = document.getElementById(drawer.dataset.scrim || 'scrim');
    if (scrim) scrim.classList.add('is-open');
    lockScroll(true);
    openDrawer = drawer;
    /* Flush the style change before focusing: focus() is a no-op while the
       panel is still `visibility: hidden`. (The stylesheet switches visibility
       with a 0s transition on open precisely so this works synchronously.) */
    void drawer.offsetWidth;
    var first = drawer.querySelector(FOCUSABLE);
    if (first) first.focus({ preventScroll: true });
  };

  KK.closeDrawer = function () {
    if (!openDrawer) return;
    openDrawer.classList.remove('is-open');
    openDrawer.setAttribute('aria-hidden', 'true');
    var scrim = document.getElementById(openDrawer.dataset.scrim || 'scrim');
    if (scrim) scrim.classList.remove('is-open');
    lockScroll(false);
    var trigger = openDrawer.dataset.trigger &&
      document.getElementById(openDrawer.dataset.trigger);
    (trigger || lastFocused || document.body).focus({ preventScroll: true });
    openDrawer = null;
  };

  function initDrawers() {
    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-drawer-open]');
      if (opener) {
        e.preventDefault();
        KK.openDrawer(document.getElementById(opener.dataset.drawerOpen));
        return;
      }
      if (e.target.closest('[data-drawer-close]')) {
        e.preventDefault();
        KK.closeDrawer();
        return;
      }
      if (e.target.classList && e.target.classList.contains('scrim')) KK.closeDrawer();
    });

    document.addEventListener('keydown', function (e) {
      if (!openDrawer) return;
      if (e.key === 'Escape') { KK.closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var items = Array.prototype.slice.call(openDrawer.querySelectorAll(FOCUSABLE))
        .filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });

    /* A drawer that is open when the layout crosses to desktop must close. */
    DESKTOP.addEventListener('change', function () {
      if (openDrawer && openDrawer.dataset.desktopClose === 'true') KK.closeDrawer();
    });
  }


  /* ====================================================================
     6. SCROLL REVEAL
     ==================================================================== */

  var revealObserver = null;

  function initScrollReveal() {
    if (REDUCED_MOTION.matches || !('IntersectionObserver' in window)) {
      KK.observeReveal = function (root) {
        (root || document).querySelectorAll('.reveal').forEach(function (el) {
          el.classList.add('is-visible');
        });
      };
    } else {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

      /**
       * The catalogue, detail page and homepage collections render after boot.
       * They call this to hand their new nodes to the same observer.
       */
      KK.observeReveal = function (root) {
        (root || document).querySelectorAll('.reveal:not(.is-visible)')
          .forEach(function (el) { revealObserver.observe(el); });
      };
    }
    KK.observeReveal(document);
  }


  /* ====================================================================
     7. ENQUIRY LIST — the B2B "quote basket"
     Buyers collect constructions while browsing, then send ONE enquiry.
     Persisted to localStorage so a list survives a reload mid-sourcing.
     ==================================================================== */

  function readStore() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      return JSON.parse(raw).filter(function (s) { return KK.productBySlug[s]; });
    } catch (err) {
      return [];   /* private mode / storage disabled — session-only list */
    }
  }

  function writeStore(slugs) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(slugs));
    } catch (err) { /* nothing to do — the list simply won't persist */ }
  }

  var slugs = readStore();
  var listeners = [];

  function emit() {
    writeStore(slugs);
    listeners.forEach(function (fn) { fn(slugs); });
  }

  KK.enquiry = {
    slugs: function () { return slugs.slice(); },
    items: function () {
      return slugs.map(function (s) { return KK.productBySlug[s]; })
        .filter(Boolean);
    },
    count: function () { return slugs.length; },
    has: function (slug) { return slugs.indexOf(slug) !== -1; },
    add: function (slug) {
      if (!KK.productBySlug[slug] || this.has(slug)) return;
      slugs.push(slug);
      emit();
    },
    remove: function (slug) {
      slugs = slugs.filter(function (s) { return s !== slug; });
      emit();
    },
    toggle: function (slug) {
      this.has(slug) ? this.remove(slug) : this.add(slug);
    },
    clear: function () { slugs = []; emit(); },
    onChange: function (fn) { listeners.push(fn); fn(slugs); }
  };

  function enquiryItemHtml(p) {
    var cat = KK.categoryBySlug[p.category];
    var meta = [p.gsm && p.gsm + ' GSM', p.moq && 'MOQ ' + p.moq]
      .filter(Boolean).join(' · ');
    return '<li class="enq-item">' +
      '<img class="enq-item__swatch" src="' + KK.swatchFor(p) + '" alt="" aria-hidden="true">' +
      '<div class="enq-item__body">' +
        '<p class="enq-item__cat">' + esc(cat ? cat.name : '') + '</p>' +
        '<a class="enq-item__name link-draw" href="fabric.html?p=' + esc(p.slug) + '">' +
          esc(p.name) + '</a>' +
        (meta ? '<p class="enq-item__meta">' + esc(meta) + '</p>' : '') +
        '<p class="enq-item__price">' + esc(KK.priceLabel(p)) + '</p>' +
      '</div>' +
      '<button type="button" class="remove-btn" data-remove="' + esc(p.slug) + '" ' +
        'aria-label="Remove ' + esc(p.name) + ' from enquiry list">' +
        KK.icon('trash') + '</button>' +
    '</li>';
  }

  function initEnquiryList() {
    var btn = document.querySelector('.enquiry-btn');
    var countEl = document.querySelector('.enquiry-btn__count');
    var drawer = document.getElementById('enquiry-drawer');
    var body = drawer && drawer.querySelector('[data-enquiry-body]');
    var sub = drawer && drawer.querySelector('[data-enquiry-sub]');
    var foot = drawer && drawer.querySelector('[data-enquiry-foot]');

    function renderDrawer() {
      if (!body) return;
      var items = KK.enquiry.items();
      if (sub) {
        sub.textContent = items.length
          ? items.length + (items.length === 1 ? ' fabric' : ' fabrics') + ' ready to send'
          : 'Collect fabrics, then send one enquiry';
      }
      if (foot) foot.hidden = items.length === 0;

      if (!items.length) {
        body.innerHTML =
          '<div class="empty">' +
            '<span class="empty__icon">' + KK.icon('package') + '</span>' +
            '<h3>Your enquiry list is empty</h3>' +
            '<p>Add the constructions you want priced while you browse, then send ' +
            'one consolidated enquiry with GSM, width and quantity against each.</p>' +
            '<div class="btn-row"><a class="btn btn--primary" href="fabrics.html">' +
            'Browse fabrics</a></div>' +
          '</div>';
        return;
      }
      body.innerHTML = '<ul>' + items.map(enquiryItemHtml).join('') + '</ul>';
    }

    KK.enquiry.onChange(function (list) {
      if (countEl) countEl.textContent = list.length;
      if (btn) btn.classList.toggle('has-items', list.length > 0);
      /* Keep every add-button on the page in sync with the list. */
      document.querySelectorAll('[data-add]').forEach(function (el) {
        el.setAttribute('aria-pressed', KK.enquiry.has(el.dataset.add) ? 'true' : 'false');
      });
      renderDrawer();
      document.querySelectorAll('[data-enquiry-count]').forEach(function (el) {
        el.textContent = list.length;
      });
      document.dispatchEvent(new CustomEvent('kk:enquirychange'));
    });

    /* Delegated so dynamically rendered cards work without re-binding. */
    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) { KK.enquiry.toggle(add.dataset.add); return; }
      var rm = e.target.closest('[data-remove]');
      if (rm) { KK.enquiry.remove(rm.dataset.remove); return; }
      if (e.target.closest('[data-enquiry-clear]')) KK.enquiry.clear();
    });
  }


  /* ====================================================================
     8. ENQUIRY FORM
     No backend: the form validates, then hands the buyer a pre-filled
     WhatsApp message plus a copyable plain-text summary. It never claims
     to have transmitted anything it has not.
     ==================================================================== */

  var QUANTITY_LABELS = {
    '100-200': '100 – 200 kg / m (trial)',
    '200-500': '200 – 500 kg / m',
    '500-2000': '500 – 2,000 kg / m',
    '2000+': '2,000 kg / m and above',
    unsure: 'Not sure yet'
  };

  function buildSummary(values) {
    var lines = [
      'Bulk fabric enquiry — ' + BUSINESS_NAME,
      '',
      'Contact      : ' + values.name,
      'Firm / brand : ' + values.company,
      'Phone        : ' + values.phone
    ];
    if (values.email) lines.push('Email        : ' + values.email);
    if (values.city) lines.push('City         : ' + values.city);
    if (values.buyerType) lines.push('Buyer type   : ' + values.buyerType);
    if (values.category) {
      var cat = KK.categoryBySlug[values.category];
      if (cat) lines.push('Category     : ' + cat.name);
    }
    if (values.quantity) {
      lines.push('Quantity     : ' + (QUANTITY_LABELS[values.quantity] || values.quantity));
    }
    lines.push('', 'Requirement:', values.specs || '(see fabrics listed below)');

    var items = KK.enquiry.items();
    if (items.length) {
      lines.push('', 'Fabrics on the enquiry list (' + items.length + '):');
      items.forEach(function (p, i) {
        var bits = [p.material, p.gsm && p.gsm + ' GSM', p.width,
          p.moq && 'MOQ ' + p.moq, KK.priceLabel(p)].filter(Boolean);
        lines.push((i + 1) + '. ' + p.name + ' — ' + bits.join(' · '));
      });
    }
    return lines.join('\n');
  }

  function fieldOf(input) { return input.closest('.field'); }

  function setError(input, message) {
    var field = fieldOf(input);
    if (!field) return;
    var box = field.querySelector('.field__error');
    if (message) {
      field.classList.add('is-invalid');
      input.setAttribute('aria-invalid', 'true');
      if (box) box.innerHTML = KK.icon('alert') + '<span>' + esc(message) + '</span>';
    } else {
      field.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    }
  }

  function validate(form) {
    var errors = 0;
    var v = function (n) { return form.elements[n]; };

    var checks = [
      [v('name'), function (val) { return val.trim() ? '' : 'Please tell us who we are speaking to.'; }],
      [v('company'), function (val) { return val.trim() ? '' : 'Your firm or brand name.'; }],
      [v('phone'), function (val) {
        var digits = val.replace(/[\s-]/g, '');
        if (!digits) return 'A number we can call you back on.';
        if (!/^\+?\d{10,14}$/.test(digits)) return 'Enter a valid phone number (10–14 digits).';
        return '';
      }],
      [v('email'), function (val) {
        if (!val) return '';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val) ? '' : 'That email address does not look right.';
      }],
      [v('specs'), function (val) {
        if (val.trim()) return '';
        return v('category') && v('category').value
          ? '' : 'Give us a construction, GSM, width or end-use to work from.';
      }]
    ];

    var firstBad = null;
    checks.forEach(function (pair) {
      var input = pair[0];
      if (!input) return;
      var message = pair[1](input.value);
      setError(input, message);
      if (message) { errors++; if (!firstBad) firstBad = input; }
    });

    if (firstBad) firstBad.focus();
    return errors === 0;
  }

  function initEnquiryForm() {
    var forms = document.querySelectorAll('[data-enquiry-form]');
    if (!forms.length) return;

    forms.forEach(function (form) {
      var attached = form.querySelector('[data-attached]');
      var attachedList = form.querySelector('[data-attached-list]');
      var result = form.parentElement.querySelector('[data-form-result]');

      /* Keep the "attached fabrics" block in step with the enquiry list. */
      function renderAttached() {
        if (!attached || !attachedList) return;
        var items = KK.enquiry.items();
        attached.hidden = items.length === 0;
        attachedList.innerHTML = items.map(function (p) {
          return '<li class="attached-item">' +
            '<img class="attached-item__swatch" src="' + KK.swatchFor(p) + '" alt="" aria-hidden="true">' +
            '<a class="attached-item__name link-draw" href="fabric.html?p=' + esc(p.slug) + '">' +
              esc(p.name) + '</a>' +
            '<span class="attached-item__spec">' + esc(p.gsm ? p.gsm + ' GSM' : p.material || '') + '</span>' +
            '<button type="button" class="remove-btn" data-remove="' + esc(p.slug) + '" ' +
              'aria-label="Remove ' + esc(p.name) + '">' + KK.icon('x') + '</button>' +
          '</li>';
        }).join('');
      }
      renderAttached();
      document.addEventListener('kk:enquirychange', renderAttached);

      /* Clear an error as soon as the buyer starts fixing it. */
      form.addEventListener('input', function (e) {
        if (e.target.getAttribute('aria-invalid') === 'true') setError(e.target, '');
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validate(form)) return;

        var el = form.elements;
        var buyerSelect = el.buyerType;
        var values = {
          name: el.name.value.trim(),
          company: el.company.value.trim(),
          phone: el.phone.value.trim(),
          email: el.email ? el.email.value.trim() : '',
          city: el.city ? el.city.value.trim() : '',
          buyerType: buyerSelect && buyerSelect.value
            ? buyerSelect.options[buyerSelect.selectedIndex].text : '',
          category: el.category ? el.category.value : '',
          quantity: el.quantity ? el.quantity.value : '',
          specs: el.specs.value.trim()
        };

        var summary = buildSummary(values);
        var waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(summary);

        if (!result) return;
        result.innerHTML =
          '<span class="form-result__tick">' + KK.icon('check') + '</span>' +
          '<h3>Your enquiry is ready to send</h3>' +
          '<p>Send it straight to us on WhatsApp, copy the summary below, or call the ' +
          'unit on ' + esc(KK.company.phoneDisplay) + '. Everything you entered — ' +
          'including your enquiry list — is in it.</p>' +
          '<pre>' + esc(summary) + '</pre>' +
          '<div class="btn-row">' +
            '<a class="btn btn--whatsapp btn--lg" href="' + esc(waUrl) + '" target="_blank" rel="noopener">' +
              KK.icon('whatsapp') + '<span>Send on WhatsApp</span></a>' +
            '<button type="button" class="btn btn--outline" data-copy>' +
              KK.icon('copy') + '<span>Copy summary</span></button>' +
            '<a class="btn btn--quiet" href="tel:' + esc(KK.company.phoneDial) + '">' +
              KK.icon('phone') + '<span>' + esc(KK.company.phoneDisplay) + '</span></a>' +
          '</div>' +
          '<div class="btn-row"><button type="button" class="btn btn--quiet btn--sm" ' +
            'data-restart>Start another enquiry</button></div>';

        result.hidden = false;
        form.hidden = true;
        result.setAttribute('tabindex', '-1');
        result.focus({ preventScroll: false });

        result.querySelector('[data-copy]').addEventListener('click', function (ev) {
          var button = ev.currentTarget;
          var label = button.querySelector('span');
          if (navigator.clipboard) {
            navigator.clipboard.writeText(summary).then(function () {
              label.textContent = 'Copied to clipboard';
              setTimeout(function () { label.textContent = 'Copy summary'; }, 1800);
            });
          }
        });
        result.querySelector('[data-restart]').addEventListener('click', function () {
          form.reset();
          form.hidden = false;
          result.hidden = true;
          form.elements.name.focus();
        });
      });
    });
  }


  /* ====================================================================
     9. IMAGE FALLBACK
     A product photograph that fails falls back to its procedural swatch,
     so a broken file never leaves a blank box.
     ==================================================================== */

  function initImageFallback() {
    document.addEventListener('error', function (e) {
      var img = e.target;
      if (img.tagName !== 'IMG' || !img.dataset.fallback) return;
      if (img.dataset.fallbackUsed) return;
      img.dataset.fallbackUsed = '1';
      img.src = img.dataset.fallback;
    }, true);
  }


  /* ====================================================================
     10. DYNAMIC LISTS
     Category and application links are generated from data.js, so counts
     and names can never drift from the catalogue.
     ==================================================================== */

  function fillDynamicLists() {
    document.querySelectorAll('[data-cat-links]').forEach(function (host) {
      var limit = parseInt(host.dataset.limit, 10) || KK.categories.length;
      host.innerHTML = KK.categories.slice(0, limit).map(function (c) {
        return '<li><a class="cat-link" href="fabrics.html?category=' + esc(c.slug) + '">' +
          '<img class="cat-link__swatch" src="' + KK.swatchFor(c) + '" alt="" aria-hidden="true">' +
          '<span class="cat-link__name">' + esc(c.name) + '</span>' +
          '<span class="cat-link__count">' + c.count + '</span></a></li>';
      }).join('');
    });

    document.querySelectorAll('[data-cat-text-links]').forEach(function (host) {
      var limit = parseInt(host.dataset.limit, 10) || KK.categories.length;
      host.innerHTML = KK.categories.slice(0, limit).map(function (c) {
        return '<a href="fabrics.html?category=' + esc(c.slug) + '" class="link-draw">' +
          esc(c.name) + '</a>';
      }).join('') +
        '<a class="footer__more" href="fabrics.html">All categories' +
        KK.icon('arrow-up-right') + '</a>';
    });

    document.querySelectorAll('[data-app-text-links]').forEach(function (host) {
      var limit = parseInt(host.dataset.limit, 10) || KK.applications.length;
      host.innerHTML = KK.applications.slice(0, limit).map(function (a) {
        return '<a href="fabrics.html?application=' + esc(a.slug) + '" class="link-draw">' +
          esc(a.name) + '</a>';
      }).join('');
    });

    /* Category <select> options on every enquiry form. */
    document.querySelectorAll('[data-category-options]').forEach(function (sel) {
      sel.innerHTML = '<option value="">Any category</option>' +
        KK.categories.map(function (c) {
          return '<option value="' + esc(c.slug) + '">' + esc(c.name) + '</option>';
        }).join('');
    });

    /* Location cards use a woven check as their backdrop. */
    document.querySelectorAll('[data-locate-card]').forEach(function (el) {
      var img = new Image();
      img.className = '';
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.src = KK.swatch({ weave: 'check', hex: '#243d59', seed: 'unit-location' });
      el.insertBefore(img, el.firstChild);
    });

    /* Live counts written straight from the data. */
    document.querySelectorAll('[data-count="products"]').forEach(function (el) {
      el.textContent = KK.products.length;
    });
    document.querySelectorAll('[data-count="categories"]').forEach(function (el) {
      el.textContent = KK.categories.length;
    });
    document.querySelectorAll('[data-count="years"]').forEach(function (el) {
      el.textContent = KK.company.yearsInBusiness;
    });
  }


  /* ====================================================================
     11. WHATSAPP LINKS
     Every [data-wa] element gets its href from the ONE constant above.
     ==================================================================== */

  /** Copy-to-clipboard for the postal address on contact.html. */
  function initCopyAddress() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-copy-address]');
      if (!btn || !navigator.clipboard) return;
      var label = btn.querySelector('span');
      navigator.clipboard
        .writeText(KK.company.name + ', ' + KK.company.addressOneLine)
        .then(function () {
          if (!label) return;
          label.textContent = 'Address copied';
          setTimeout(function () { label.textContent = 'Copy address'; }, 1800);
        });
    });
  }


  function initWhatsAppLinks() {
    var base = 'https://wa.me/' + WHATSAPP_NUMBER;
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      var msg = el.dataset.waMsg ||
        'Hello ' + BUSINESS_NAME + ', I would like a quotation for bulk fabric. ' +
        'Please share rates and MOQ.';
      el.setAttribute('href', base + '?text=' + encodeURIComponent(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }


  /* ====================================================================
     12. FOOTER YEAR
     ==================================================================== */

  function setFooterYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }


  /* ====================================================================
     BOOT
     ==================================================================== */

  function boot() {
    syncHeaderHeight();
    initHeaderScroll();
    initDrawers();
    fillDynamicLists();
    initEnquiryList();
    initEnquiryForm();
    initWhatsAppLinks();
    initCopyAddress();
    initImageFallback();
    setFooterYear();
    initScrollReveal();

    /* Mark the current page in both navs. */
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      if (link.getAttribute('href') === here) link.setAttribute('aria-current', 'page');
    });

    /* Pages that render their own markup (the detail view) tell us when the
       DOM exists, so WhatsApp links and enquiry buttons get wired there too. */
    document.addEventListener('kk:rendered', function () {
      initWhatsAppLinks();
      document.querySelectorAll('[data-add]').forEach(function (el) {
        el.setAttribute('aria-pressed', KK.enquiry.has(el.dataset.add) ? 'true' : 'false');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

}(window, document));
