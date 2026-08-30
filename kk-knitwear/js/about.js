/* ==========================================================================
   K.K KNITWEAR CLUB — about.js
   --------------------------------------------------------------------------
   Two data-driven pieces on about.html:

     1. the weave strip — a parallax band of real constructions
     2. the gallery — one tile per construction we knit, each linking to a
        real catalogue line so the gallery is navigation, not decoration
   ========================================================================== */

(function (window, document) {
  'use strict';

  var KK = window.KK;
  if (!KK) return;

  var STRIP = [
    { weave: 'dot', hex: '#6b2e4a', seed: 'strip-dot' },
    { weave: 'interlock', hex: '#243d59', seed: 'strip-interlock' },
    { weave: 'matty', hex: '#2a5b6b', seed: 'strip-matty' },
    { weave: 'fleece', hex: '#d9d0c4', seed: 'strip-fleece' },
    { weave: 'sparkle', hex: '#14222f', seed: 'strip-sparkle' },
    { weave: 'honeycomb', hex: '#b78a42', seed: 'strip-honeycomb' }
  ];

  function renderStrip() {
    var host = document.querySelector('[data-weave-strip]');
    if (!host) return;
    host.innerHTML = '<div class="weave-strip__track">' +
      STRIP.map(function (s, i) {
        return '<div class="weave-strip__tile" style="transform:translateY(' +
          ((i % 2 ? 1 : -1) * 14) + 'px)">' +
          '<img src="' + KK.swatch(s) + '" alt="" aria-hidden="true"></div>';
      }).join('') + '</div>';
  }

  /**
   * One representative product per weave family, in catalogue order — so
   * every gallery tile opens something real.
   */
  function renderGallery() {
    var host = document.querySelector('[data-weave-gallery]');
    if (!host) return;

    var seen = {};
    var picks = [];
    KK.products.forEach(function (p) {
      if (seen[p.weave]) return;
      seen[p.weave] = true;
      picks.push(p);
    });

    host.innerHTML = picks.map(function (p) {
      return '<a class="gallery__tile" href="fabric.html?p=' + KK.esc(p.slug) + '">' +
        '<span class="gallery__img">' +
          '<img src="' + KK.swatchFor(p) + '" loading="lazy" decoding="async" ' +
            'alt="' + KK.esc(KK.weaveLabel(p.weave)) + ' construction — ' +
            KK.esc(p.name) + '">' +
        '</span>' +
        '<span class="gallery__meta">' +
          '<span class="gallery__weave">' + KK.esc(KK.weaveLabel(p.weave)) + '</span>' +
          '<span class="gallery__name">' + KK.esc(p.name) + '</span>' +
        '</span>' +
      '</a>';
    }).join('');
  }

  function start() {
    renderStrip();
    renderGallery();
    if (KK.observeReveal) KK.observeReveal(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

}(window, document));
