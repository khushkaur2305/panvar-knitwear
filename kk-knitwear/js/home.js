/* ==========================================================================
   K.K KNITWEAR CLUB — home.js
   --------------------------------------------------------------------------
   Renders the three data-driven collections on the homepage:

     1. the fabric-category bento grid
     2. the featured product cards
     3. the applications / industries-served list, plus its editorial panel

   Everything else on index.html is hand-written HTML. These three are
   generated from js/data.js so names, counts and specifications can never
   drift from the catalogue.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var KK = window.KK;
  if (!KK) return;

  /* The line the editorial panel leads with — chosen because it publishes
     the widest set of end-uses of anything in the catalogue. */
  var PANEL_SLUG = 'surplus-polyester-fabric';


  function renderCategories() {
    var host = document.querySelector('[data-home-categories]');
    if (!host) return;
    host.innerHTML = KK.categories.map(function (c, i) {
      return KK.categoryTileHtml(c, i === 0);
    }).join('');
  }


  function renderFeatured() {
    var host = document.querySelector('[data-home-featured]');
    if (!host) return;
    host.innerHTML = KK.featured.slice(0, 6).map(KK.productCardHtml).join('');
  }


  function renderApplications() {
    var host = document.querySelector('[data-home-applications]');
    if (!host) return;

    var ICONS = {
      apparel: 'shirt', sportswear: 'activity', lowers: 'person',
      tshirt: 'shirt', uniform: 'cap', ethnic: 'sparkle', home: 'sofa',
      lining: 'layers', events: 'tent', industrial: 'factory'
    };

    host.innerHTML = KK.applications.map(function (a) {
      return '<a class="app-row" href="fabrics.html?application=' + KK.esc(a.slug) + '">' +
        '<span class="app-row__icon">' + KK.icon(ICONS[a.icon] || a.icon) + '</span>' +
        '<span class="app-row__text">' +
          '<span class="app-row__name">' + KK.esc(a.name) + '</span>' +
          (a.example ? '<span class="app-row__eg">e.g. ' + KK.esc(a.example.name) + '</span>' : '') +
        '</span>' +
        '<span class="app-row__count">' + a.count +
          (a.count === 1 ? ' line' : ' lines') + '</span>' +
        '<span class="app-row__arrow">' + KK.icon('arrow-right') + '</span>' +
      '</a>';
    }).join('');
  }


  function renderPanel() {
    var host = document.querySelector('[data-app-panel]');
    if (!host) return;
    var p = KK.productBySlug[PANEL_SLUG];
    if (!p) return;

    host.innerHTML =
      '<img src="' + KK.swatch({ weave: 'rice', hex: '#243d59', seed: 'applications-panel' }) +
        '" alt="" aria-hidden="true">' +
      '<span class="panel__veil"></span>' +
      '<span class="panel__body">' +
        '<span class="eyebrow eyebrow--light">Broadest single line</span>' +
        '<h3>' + KK.esc(p.name) + ' covers ' + p.usage.length + ' end-uses on its own</h3>' +
        '<p>' + KK.esc(p.usage.join(', ')) + ' — ' +
          KK.esc([p.gsm && p.gsm + ' GSM', p.width, 'Dri-Fit finish',
            'negotiable in bulk'].filter(Boolean).join(', ')) + '.</p>' +
        '<a class="panel__cta" href="fabric.html?p=' + KK.esc(p.slug) + '">' +
          'View the specification' + KK.icon('arrow-right') + '</a>' +
      '</span>';
  }


  function start() {
    renderCategories();
    renderFeatured();
    renderApplications();
    renderPanel();
    /* Freshly rendered nodes carry .reveal — hand them to the observer. */
    if (KK.observeReveal) KK.observeReveal(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

}(window, document));
