/* ==========================================================================
   K.K KNITWEAR CLUB — catalogue.js
   --------------------------------------------------------------------------
   The fabric catalogue on fabrics.html.

     1.  state           read from / written to the query string
     2.  matching        text search + five filter dimensions
     3.  facets          counts that exclude the dimension being counted
     4.  renderFilters   ONE panel, moved between sidebar and mobile drawer
     5.  renderResults   grid or detailed list, with skeleton + empty states

   Every filter lives in the URL, so any filtered view is linkable and
   shareable — which is how a sourcing manager sends a shortlist to a
   colleague.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var KK = window.KK;
  if (!KK) return;

  var esc = KK.esc;

  var GSM_BANDS = [
    { value: 'lt120', label: 'Under 120 GSM', test: function (g) { return g < 120; } },
    { value: '120-160', label: '120 – 160 GSM', test: function (g) { return g >= 120 && g < 160; } },
    { value: '160-200', label: '160 – 200 GSM', test: function (g) { return g >= 160 && g < 200; } },
    { value: 'gt200', label: '200 GSM and above', test: function (g) { return g >= 200; } }
  ];

  var UNITS = [
    { value: 'Kg', label: 'Priced per kilogram' },
    { value: 'Meter', label: 'Priced per metre' }
  ];

  var SORTS = [
    { value: 'featured', label: 'Featured first' },
    { value: 'price-asc', label: 'Rate: low to high' },
    { value: 'price-desc', label: 'Rate: high to low' },
    { value: 'gsm-asc', label: 'GSM: light to heavy' },
    { value: 'gsm-desc', label: 'GSM: heavy to light' },
    { value: 'name', label: 'Name: A – Z' }
  ];

  function band(value) {
    return GSM_BANDS.filter(function (b) { return b.value === value; })[0];
  }


  /* ====================================================================
     SEARCH INDEX — every published field a buyer might type
     ==================================================================== */

  var INDEX = {};
  KK.products.forEach(function (p) {
    var cat = KK.categoryBySlug[p.category];
    INDEX[p.slug] = [
      p.name, p.material, p.pattern, p.color, p.gsm, p.width, p.packaging,
      cat && cat.name, KK.weaveLabel(p.weave)
    ].concat(p.usage || [])
     .concat((p.extras || []).map(function (e) { return e.label + ' ' + e.value; }))
     .filter(Boolean).join(' ').toLowerCase();
  });


  /* ====================================================================
     1. STATE
     ==================================================================== */

  var state = {
    q: '', categories: [], apps: [], gsm: [], units: [],
    samples: false, sort: 'featured', view: 'grid'
  };

  function csv(v) { return v ? v.split(',').filter(Boolean) : []; }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    state.q = (p.get('q') || '').trim().toLowerCase();
    state.categories = csv(p.get('category'));
    state.apps = csv(p.get('application'));
    state.gsm = csv(p.get('gsm'));
    state.units = csv(p.get('unit'));
    state.samples = p.get('samples') === '1';
    state.sort = p.get('sort') || 'featured';
    state.view = p.get('view') === 'list' ? 'list' : 'grid';
  }

  function writeUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set('q', state.q);
    if (state.categories.length) p.set('category', state.categories.join(','));
    if (state.apps.length) p.set('application', state.apps.join(','));
    if (state.gsm.length) p.set('gsm', state.gsm.join(','));
    if (state.units.length) p.set('unit', state.units.join(','));
    if (state.samples) p.set('samples', '1');
    if (state.sort !== 'featured') p.set('sort', state.sort);
    if (state.view !== 'grid') p.set('view', state.view);
    var qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }


  /* ====================================================================
     2. MATCHING
     `skip` omits one dimension so facet counts stay honest.
     ==================================================================== */

  function matches(p, skip) {
    if (skip !== 'q' && state.q) {
      var hay = INDEX[p.slug];
      var terms = state.q.split(/\s+/).filter(Boolean);
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) === -1) return false;
      }
    }
    if (skip !== 'categories' && state.categories.length &&
        state.categories.indexOf(p.category) === -1) return false;

    if (skip !== 'apps' && state.apps.length) {
      var hit = state.apps.some(function (a) {
        return p.apps && p.apps.indexOf(a) !== -1;
      });
      if (!hit) return false;
    }
    if (skip !== 'gsm' && state.gsm.length) {
      var g = KK.gsmValue(p);
      if (g == null) return false;
      var inBand = state.gsm.some(function (v) {
        var b = band(v);
        return b && b.test(g);
      });
      if (!inBand) return false;
    }
    if (skip !== 'units' && state.units.length &&
        state.units.indexOf(p.unit) === -1) return false;

    if (skip !== 'samples' && state.samples && p.sampleOrders !== true) return false;
    return true;
  }

  function sortList(list) {
    var out = list.slice();
    switch (state.sort) {
      case 'price-asc':
        return out.sort(function (a, b) {
          return (a.price == null ? 1e9 : a.price) - (b.price == null ? 1e9 : b.price);
        });
      case 'price-desc':
        return out.sort(function (a, b) {
          return (b.price == null ? -1 : b.price) - (a.price == null ? -1 : a.price);
        });
      case 'gsm-asc':
        return out.sort(function (a, b) {
          var x = KK.gsmValue(a), y = KK.gsmValue(b);
          return (x == null ? 1e9 : x) - (y == null ? 1e9 : y);
        });
      case 'gsm-desc':
        return out.sort(function (a, b) {
          var x = KK.gsmValue(a), y = KK.gsmValue(b);
          return (y == null ? -1 : y) - (x == null ? -1 : x);
        });
      case 'name':
        return out.sort(function (a, b) { return a.name.localeCompare(b.name); });
      default:
        return out.sort(function (a, b) {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
                 a.name.localeCompare(b.name);
        });
    }
  }


  /* ====================================================================
     3. FACETS
     ==================================================================== */

  function countWhere(skip, predicate) {
    return KK.products.filter(function (p) {
      return matches(p, skip) && predicate(p);
    }).length;
  }

  function facets() {
    var f = { categories: {}, apps: {}, gsm: {}, units: {} };
    KK.categories.forEach(function (c) {
      f.categories[c.slug] = countWhere('categories', function (p) {
        return p.category === c.slug;
      });
    });
    KK.applications.forEach(function (a) {
      f.apps[a.slug] = countWhere('apps', function (p) {
        return p.apps && p.apps.indexOf(a.slug) !== -1;
      });
    });
    GSM_BANDS.forEach(function (b) {
      f.gsm[b.value] = countWhere('gsm', function (p) {
        var g = KK.gsmValue(p);
        return g != null && b.test(g);
      });
    });
    UNITS.forEach(function (u) {
      f.units[u.value] = countWhere('units', function (p) { return p.unit === u.value; });
    });
    f.samples = countWhere('samples', function (p) { return p.sampleOrders === true; });
    return f;
  }


  /* ====================================================================
     4. FILTER PANEL — built once, moved between sidebar and drawer
     ==================================================================== */

  var panel = document.createElement('div');
  panel.className = 'filters';

  function checkRow(opts) {
    return '<label class="check' + (opts.count === 0 && !opts.checked ? ' is-empty' : '') + '">' +
      '<span class="check__box">' +
        '<input type="checkbox" data-filter="' + esc(opts.group) + '" ' +
          'value="' + esc(opts.value) + '"' + (opts.checked ? ' checked' : '') + '>' +
        '<svg class="check__tick" viewBox="0 0 14 14" aria-hidden="true">' +
          '<path d="M2 7.4 5.2 10.6 12 3.8" fill="none" stroke="currentColor" ' +
          'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</span>' +
      (opts.swatch ? '<img class="check__swatch" src="' + opts.swatch + '" alt="" aria-hidden="true">' : '') +
      '<span class="check__label">' + esc(opts.label) + '</span>' +
      (opts.count != null ? '<span class="check__count">' + opts.count + '</span>' : '') +
    '</label>';
  }

  function group(title, activeCount, inner, scroll) {
    return '<div class="filter-group">' +
      '<div class="filter-group__head">' +
        '<h3 class="filter-group__title">' + esc(title) + '</h3>' +
        (activeCount ? '<span class="filter-group__count">' + activeCount + '</span>' : '') +
      '</div>' +
      '<div class="' + (scroll ? 'filter-group__list' : '') + '">' + inner + '</div>' +
    '</div>';
  }

  function renderFilters(f) {
    var dirty = activeCount() > 0 || !!state.q;

    panel.innerHTML =
      '<div class="filters__head">' +
        '<h2>Refine</h2>' +
        (dirty ? '<button type="button" class="clear-all" data-filters-reset>Reset all</button>' : '') +
      '</div>' +

      group('Category', state.categories.length,
        KK.categories.map(function (c) {
          return checkRow({
            group: 'categories', value: c.slug, label: c.name,
            count: f.categories[c.slug],
            checked: state.categories.indexOf(c.slug) !== -1,
            swatch: KK.swatchFor(c)
          });
        }).join(''), true) +

      group('Application', state.apps.length,
        KK.applications.map(function (a) {
          return checkRow({
            group: 'apps', value: a.slug, label: a.name,
            count: f.apps[a.slug],
            checked: state.apps.indexOf(a.slug) !== -1
          });
        }).join(''), true) +

      group('Weight', state.gsm.length,
        GSM_BANDS.map(function (b) {
          return checkRow({
            group: 'gsm', value: b.value, label: b.label,
            count: f.gsm[b.value],
            checked: state.gsm.indexOf(b.value) !== -1
          });
        }).join('')) +

      group('Sold by', state.units.length,
        UNITS.map(function (u) {
          return checkRow({
            group: 'units', value: u.value, label: u.label,
            count: f.units[u.value],
            checked: state.units.indexOf(u.value) !== -1
          });
        }).join('')) +

      group('Sampling', 0,
        checkRow({
          group: 'samples', value: '1', label: 'Sample orders accepted',
          count: f.samples, checked: state.samples
        }));
  }

  /** Sidebar on desktop, drawer on mobile — same DOM node either way. */
  function placePanel() {
    var host = KK.DESKTOP.matches
      ? document.querySelector('[data-filters-desktop]')
      : document.querySelector('[data-filters-mobile]');
    if (host && panel.parentElement !== host) host.appendChild(panel);
  }

  function activeCount() {
    return state.categories.length + state.apps.length + state.gsm.length +
      state.units.length + (state.samples ? 1 : 0);
  }


  /* ====================================================================
     5. RESULTS
     ==================================================================== */

  var results = document.querySelector('[data-results]');
  var countEl = document.querySelector('[data-result-count]');
  var chipsEl = document.querySelector('[data-active-chips]');
  var promptEl = document.querySelector('[data-prompt]');
  var settleTimer = null;

  function skeleton(n) {
    var card = '<div class="skel-card" aria-hidden="true">' +
      '<div class="skeleton skel-card__media"></div>' +
      '<div class="skel-card__body">' +
        '<div class="skeleton skel-line" style="width:35%"></div>' +
        '<div class="skeleton skel-line" style="width:80%;height:1.1rem"></div>' +
        '<div class="skeleton skel-line" style="width:60%"></div>' +
      '</div></div>';
    return '<div class="product-grid" role="status" aria-label="Loading fabrics">' +
      new Array(n + 1).join(card) + '</div>';
  }

  function emptyState() {
    var body = state.q
      ? 'Nothing in the catalogue matches “' + esc(state.q) + '” with the filters you ' +
        'have on. Try a broader term — a construction like “dot knit”, a weight like ' +
        '“160”, or an end-use like “sportswear”.'
      : 'Those filters are too narrow together. Clear one or two, or send us the ' +
        'specification and we will tell you what we can knit.';
    return '<div class="empty">' +
      '<span class="empty__icon">' + KK.icon('search-x') + '</span>' +
      '<h3>No fabric matches those filters</h3>' +
      '<p>' + body + '</p>' +
      '<div class="btn-row">' +
        '<button type="button" class="btn btn--outline" data-filters-reset>Clear all filters</button>' +
        '<a class="btn btn--brass" href="contact.html#enquiry">Ask for a custom construction</a>' +
      '</div></div>';
  }

  function renderChips() {
    var chips = [];
    state.categories.forEach(function (slug) {
      var c = KK.categoryBySlug[slug];
      if (c) chips.push({ group: 'categories', value: slug, label: c.name });
    });
    state.apps.forEach(function (slug) {
      var a = KK.applications.filter(function (x) { return x.slug === slug; })[0];
      if (a) chips.push({ group: 'apps', value: slug, label: a.name });
    });
    state.gsm.forEach(function (v) {
      var b = band(v);
      if (b) chips.push({ group: 'gsm', value: v, label: b.label });
    });
    state.units.forEach(function (v) {
      var u = UNITS.filter(function (x) { return x.value === v; })[0];
      if (u) chips.push({ group: 'units', value: v, label: u.label });
    });
    if (state.samples) {
      chips.push({ group: 'samples', value: '1', label: 'Sample orders accepted' });
    }

    chipsEl.hidden = chips.length === 0;
    chipsEl.innerHTML = chips.map(function (c) {
      return '<button type="button" class="active-chip" data-chip-group="' + esc(c.group) +
        '" data-chip-value="' + esc(c.value) + '">' + esc(c.label) + KK.icon('x') + '</button>';
    }).join('') +
      (chips.length ? '<button type="button" class="clear-all" data-filters-reset>Clear all</button>' : '');
  }

  function render(showSkeleton) {
    var list = sortList(KK.products.filter(function (p) { return matches(p); }));
    var f = facets();

    renderFilters(f);
    placePanel();
    renderChips();

    /* Toolbar */
    var n = activeCount();
    var badge = document.querySelector('[data-active-count]');
    if (badge) { badge.hidden = n === 0; badge.textContent = n; }
    var sub = document.querySelector('[data-filters-sub]');
    if (sub) sub.textContent = list.length + ' of ' + KK.products.length + ' lines match';
    var apply = document.querySelector('[data-filters-apply]');
    if (apply) apply.textContent = 'Show ' + list.length;

    function paint() {
      countEl.textContent = list.length + ' of ' + KK.products.length + ' lines';
      if (!list.length) {
        results.innerHTML = emptyState();
        promptEl.hidden = true;
        return;
      }
      results.innerHTML = state.view === 'list'
        ? list.map(KK.productRowHtml).join('')
        : '<div class="product-grid">' + list.map(KK.productCardHtml).join('') + '</div>';
      promptEl.hidden = false;
      if (KK.observeReveal) KK.observeReveal(results);
    }

    if (showSkeleton && !KK.REDUCED_MOTION.matches) {
      countEl.textContent = 'Filtering…';
      results.innerHTML = skeleton(state.view === 'list' ? 4 : 9);
      promptEl.hidden = true;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(paint, 240);
    } else {
      paint();
    }
  }

  function update(showSkeleton) {
    writeUrl();
    render(showSkeleton !== false);
  }


  /* ====================================================================
     WIRING
     ==================================================================== */

  function toggleIn(key, value, on) {
    if (key === 'samples') { state.samples = on; return; }
    var arr = state[key];
    var i = arr.indexOf(value);
    if (on && i === -1) arr.push(value);
    if (!on && i !== -1) arr.splice(i, 1);
  }

  function resetAll() {
    state.q = '';
    state.categories = [];
    state.apps = [];
    state.gsm = [];
    state.units = [];
    state.samples = false;
    var search = document.getElementById('catalogueSearch');
    if (search) search.value = '';
    update();
  }

  function start() {
    readUrl();

    /* Sort options */
    var sortSel = document.querySelector('[data-sort]');
    sortSel.innerHTML = SORTS.map(function (s) {
      return '<option value="' + s.value + '"' +
        (s.value === state.sort ? ' selected' : '') + '>' + esc(s.label) + '</option>';
    }).join('');
    sortSel.addEventListener('change', function () {
      state.sort = sortSel.value;
      update();
    });

    /* Search, debounced so the grid stays calm while typing */
    var search = document.getElementById('catalogueSearch');
    if (search) {
      search.value = new URLSearchParams(location.search).get('q') || '';
      var t;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          state.q = search.value.trim().toLowerCase();
          update();
        }, 200);
      });
    }

    /* View toggle */
    document.querySelectorAll('[data-view]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.view = btn.dataset.view;
        document.querySelectorAll('[data-view]').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        update();
      });
    });

    /* Filter checkboxes (delegated — the panel is re-rendered constantly) */
    document.addEventListener('change', function (e) {
      var input = e.target.closest('[data-filter]');
      if (!input) return;
      toggleIn(input.dataset.filter, input.value, input.checked);
      update();
    });

    /* Chips, reset buttons */
    document.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-chip-group]');
      if (chip) {
        toggleIn(chip.dataset.chipGroup, chip.dataset.chipValue, false);
        update();
        return;
      }
      if (e.target.closest('[data-filters-reset]')) {
        resetAll();
        if (KK.closeDrawer) KK.closeDrawer();
      }
    });

    /* Keep the panel in the right host when the layout crosses 900px. */
    KK.DESKTOP.addEventListener('change', placePanel);

    /* Back/forward through filtered views. */
    window.addEventListener('popstate', function () {
      readUrl();
      if (search) search.value = new URLSearchParams(location.search).get('q') || '';
      document.querySelectorAll('[data-view]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.view === state.view ? 'true' : 'false');
      });
      render(false);
    });

    document.querySelectorAll('[data-view]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.view === state.view ? 'true' : 'false');
    });

    render(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

}(window, document));
