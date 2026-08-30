/* ==========================================================================
   K.K KNITWEAR CLUB — swatch.js
   --------------------------------------------------------------------------
   Procedural fabric swatch renderer.

   There is no licensed photo library for this business, and generic stock
   photography would misrepresent the actual cloth. So instead of faking it,
   this module DRAWS each fabric's construction — plain, interlock, matty,
   dot, rice, honeycomb, waffle, mesh, terry and so on — as a deterministic
   SVG texture in the product's published colour, returned as a data URI.

   The upside: no network requests, no CORS, no layout shift, no licensing
   question, and the imagery is genuinely informative — a buyer can see a
   waffle apart from a honeycomb.

   PUBLIC API
     KK.swatch({ weave, hex, seed, multi })   → data: URI string
     KK.swatchFor(productOrCategory)          → the same, from a record
     KK.weaveLabel(weave)                     → human-readable name

   SWAPPING IN REAL PHOTOGRAPHY
     Add  image: 'assets/products/<slug>.jpg'  to a product in js/data.js.
     Renderers prefer the photograph and fall back here if it fails to load.
   ========================================================================== */

(function (window) {
  'use strict';

  var KK = (window.KK = window.KK || {});

  /** Every swatch is drawn on this square, then scaled by CSS. */
  var TILE = 320;


  /* ======================================================================
     COLOUR HELPERS
     ====================================================================== */

  function hexToRgb(hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  }

  function clamp255(n) {
    return Math.max(0, Math.min(255, Math.round(n)));
  }

  /** Move a colour toward white (amount > 0) or black (amount < 0). */
  function shift(hex, amount) {
    var rgb = hexToRgb(hex);
    var target = amount > 0 ? 255 : 0;
    var p = Math.abs(amount);
    return '#' + rgb.map(function (c) {
      var v = clamp255(c + (target - c) * p).toString(16);
      return v.length === 1 ? '0' + v : v;
    }).join('');
  }

  function luminance(hex) {
    var rgb = hexToRgb(hex).map(function (c) {
      var s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  }

  /** Exposed so renderers can pick a readable overlay for pale cloth. */
  KK.isLightSwatch = function (hex) {
    return luminance(hex || '#3D648B') > 0.55;
  };

  /**
   * Deterministic pseudo-random from a string seed + index (FNV-1a).
   * Stable output means a swatch never "reshuffles" between page loads.
   */
  function rand(seed, i) {
    var s = seed + ':' + i;
    var h = 2166136261;
    for (var k = 0; k < s.length; k++) {
      h ^= s.charCodeAt(k);
      h = (h * 16777619) >>> 0;
    }
    return (h % 100000) / 100000;
  }


  /* ======================================================================
     WEAVE DEFINITIONS
     Each builder gets { ink, high } — a thread-shadow and a thread-highlight
     derived from the base colour, so every swatch stays monochromatic and
     reads as cloth rather than as graphic pattern.
     ====================================================================== */

  var WEAVES = {

    /* Fine warp/weft ruling — the default knitted face. */
    plain: function (c) {
      return {
        defs:
          '<pattern id="w" width="6" height="6" patternUnits="userSpaceOnUse">' +
            '<path d="M0 0.5H6M0 3.5H6" stroke="' + c.ink + '" stroke-width="1" opacity=".22"/>' +
            '<path d="M0.5 0V6M3.5 0V6" stroke="' + c.high + '" stroke-width="1" opacity=".14"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Looped columns — the stable, low-curl double-knit face. */
    interlock: function (c) {
      return {
        defs:
          '<pattern id="w" width="12" height="10" patternUnits="userSpaceOnUse">' +
            '<path d="M1 10C1 5 5 5 5 0M7 10C7 5 11 5 11 0" fill="none" stroke="' + c.ink + '" stroke-width="1.6" opacity=".26"/>' +
            '<path d="M2 10C2 5 6 5 6 0M8 10C8 5 12 5 12 0" fill="none" stroke="' + c.high + '" stroke-width="1" opacity=".2"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Basket-weave blocks — the polo/matty face. */
    matty: function (c) {
      return {
        defs:
          '<pattern id="w" width="16" height="16" patternUnits="userSpaceOnUse">' +
            '<rect x="0" y="0" width="8" height="8" fill="' + c.high + '" opacity=".16"/>' +
            '<rect x="8" y="8" width="8" height="8" fill="' + c.high + '" opacity=".16"/>' +
            '<rect x="8" y="0" width="8" height="8" fill="' + c.ink + '" opacity=".2"/>' +
            '<rect x="0" y="8" width="8" height="8" fill="' + c.ink + '" opacity=".2"/>' +
            '<path d="M0 4H16M0 12H16" stroke="' + c.ink + '" stroke-width=".8" opacity=".16"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Polka dot knit. */
    dot: function (c) {
      return {
        defs:
          '<pattern id="w" width="30" height="30" patternUnits="userSpaceOnUse">' +
            '<circle cx="8" cy="8" r="4.4" fill="' + c.high + '" opacity=".5"/>' +
            '<circle cx="8" cy="8" r="4.4" fill="none" stroke="' + c.ink + '" stroke-width="1" opacity=".35"/>' +
            '<circle cx="23" cy="23" r="4.4" fill="' + c.high + '" opacity=".5"/>' +
            '<circle cx="23" cy="23" r="4.4" fill="none" stroke="' + c.ink + '" stroke-width="1" opacity=".35"/>' +
            '<path d="M0 .5H30" stroke="' + c.ink + '" stroke-width=".7" opacity=".1"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Fine dot — reads as solid at a distance. */
    'micro-dot': function (c) {
      return {
        defs:
          '<pattern id="w" width="12" height="12" patternUnits="userSpaceOnUse">' +
            '<circle cx="3" cy="3" r="1.7" fill="' + c.high + '" opacity=".48"/>' +
            '<circle cx="9" cy="9" r="1.7" fill="' + c.ink + '" opacity=".34"/>' +
            '<path d="M0 6H12" stroke="' + c.ink + '" stroke-width=".6" opacity=".12"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Rice-grain texture. */
    rice: function (c) {
      return {
        defs:
          '<pattern id="w" width="14" height="14" patternUnits="userSpaceOnUse">' +
            '<rect x="2" y="2.4" width="6" height="2.4" rx="1.2" fill="' + c.high + '" opacity=".42" transform="rotate(-24 5 3.6)"/>' +
            '<rect x="8" y="9.2" width="6" height="2.4" rx="1.2" fill="' + c.ink + '" opacity=".34" transform="rotate(-24 11 10.4)"/>' +
            '<rect x="-3" y="9.2" width="6" height="2.4" rx="1.2" fill="' + c.ink + '" opacity=".34" transform="rotate(-24 0 10.4)"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Hexagonal honeycomb cells. */
    honeycomb: function (c) {
      return {
        defs:
          '<pattern id="w" width="28" height="32" patternUnits="userSpaceOnUse">' +
            '<path d="M14 0 L26 7 L26 21 L14 28 L2 21 L2 7 Z" fill="none" stroke="' + c.ink + '" stroke-width="1.5" opacity=".3"/>' +
            '<path d="M14 2 L24 8 L24 20 L14 26 L4 20 L4 8 Z" fill="none" stroke="' + c.high + '" stroke-width="1" opacity=".22"/>' +
            '<path d="M0 28 L2 29 M26 29 L28 28" stroke="' + c.ink + '" stroke-width="1.5" opacity=".3"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Square waffle cells. */
    waffle: function (c) {
      return {
        defs:
          '<pattern id="w" width="20" height="20" patternUnits="userSpaceOnUse">' +
            '<rect x="1" y="1" width="18" height="18" fill="none" stroke="' + c.ink + '" stroke-width="2" opacity=".28"/>' +
            '<rect x="4" y="4" width="12" height="12" fill="none" stroke="' + c.high + '" stroke-width="1.4" opacity=".22"/>' +
            '<rect x="8" y="8" width="4" height="4" fill="' + c.ink + '" opacity=".18"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Circular-knitted micro mesh / jali. */
    mesh: function (c) {
      return {
        defs:
          '<pattern id="w" width="14" height="14" patternUnits="userSpaceOnUse">' +
            '<path d="M0 7H14M7 0V14" stroke="' + c.ink + '" stroke-width="2.2" opacity=".3"/>' +
            '<path d="M0 6H14M6 0V14" stroke="' + c.high + '" stroke-width="1" opacity=".3"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Dense loop pile. */
    terry: function (c, seed) {
      var loops = '';
      for (var i = 0; i < 320; i++) {
        var x = (rand(seed, i * 3) * TILE).toFixed(1);
        var y = (rand(seed, i * 3 + 1) * TILE).toFixed(1);
        var r = (3 + rand(seed, i * 3 + 2) * 4).toFixed(1);
        loops += '<circle cx="' + x + '" cy="' + y + '" r="' + r +
          '" fill="none" stroke="' + (i % 2 ? c.high : c.ink) +
          '" stroke-width="1.6" opacity="' + (i % 2 ? '.28' : '.22') + '"/>';
      }
      return { defs: '', body: loops };
    },

    stripe: function (c) {
      return {
        defs:
          '<pattern id="w" width="24" height="24" patternUnits="userSpaceOnUse">' +
            '<rect y="0" width="24" height="9" fill="' + c.ink + '" opacity=".2"/>' +
            '<rect y="11" width="24" height="2" fill="' + c.high + '" opacity=".4"/>' +
            '<path d="M0 0H24" stroke="' + c.ink + '" stroke-width=".8" opacity=".2"/>' +
          '</pattern>',
        body: fill()
      };
    },

    check: function (c) {
      return {
        defs:
          '<pattern id="w" width="44" height="44" patternUnits="userSpaceOnUse">' +
            '<rect x="0" y="0" width="22" height="22" fill="' + c.high + '" opacity=".14"/>' +
            '<rect x="22" y="22" width="22" height="22" fill="' + c.high + '" opacity=".14"/>' +
            '<path d="M0 21.5H44M21.5 0V44" stroke="' + c.ink + '" stroke-width="3" opacity=".22"/>' +
            '<path d="M0 10H44M10 0V44" stroke="' + c.ink + '" stroke-width=".9" opacity=".12"/>' +
          '</pattern>',
        body: fill()
      };
    },

    /* Chamki / rim zim shimmer. */
    sparkle: function (c, seed) {
      var glints = '';
      for (var i = 0; i < 70; i++) {
        var x = rand(seed, i * 4) * TILE;
        var y = rand(seed, i * 4 + 1) * TILE;
        var s = 3 + rand(seed, i * 4 + 2) * 6;
        glints +=
          '<path d="M' + x.toFixed(1) + ' ' + (y - s).toFixed(1) +
          ' L' + (x + s * 0.28).toFixed(1) + ' ' + y.toFixed(1) +
          ' L' + x.toFixed(1) + ' ' + (y + s).toFixed(1) +
          ' L' + (x - s * 0.28).toFixed(1) + ' ' + y.toFixed(1) +
          ' Z" fill="#fff" opacity="' + (0.24 + rand(seed, i * 4 + 3) * 0.4).toFixed(2) + '"/>';
      }
      return {
        defs:
          '<pattern id="w" width="8" height="8" patternUnits="userSpaceOnUse">' +
            '<path d="M0 4H8" stroke="' + c.ink + '" stroke-width=".8" opacity=".16"/>' +
            '<path d="M4 0V8" stroke="' + c.high + '" stroke-width=".8" opacity=".12"/>' +
          '</pattern>',
        body: fill() + glints
      };
    },

    /* Soft-handle sweater / astar / foma. */
    fleece: function (c, seed) {
      var blobs = '';
      for (var i = 0; i < 120; i++) {
        var x = rand(seed, i * 5) * TILE;
        var y = rand(seed, i * 5 + 1) * TILE;
        var rx = 10 + rand(seed, i * 5 + 2) * 22;
        var ry = rx * (0.5 + rand(seed, i * 5 + 3) * 0.5);
        blobs +=
          '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) +
          '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) +
          '" fill="' + (i % 3 === 0 ? c.ink : c.high) +
          '" opacity="' + (i % 3 === 0 ? '.14' : '.16') +
          '" transform="rotate(' + (rand(seed, i * 5 + 4) * 180).toFixed(0) +
          ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
      }
      return {
        defs: '<filter id="soft"><feGaussianBlur stdDeviation="3.5"/></filter>',
        body: '<g filter="url(#soft)">' + blobs + '</g>'
      };
    },

    /* Printed chair-cover / tent cloth. */
    printed: function (c, seed) {
      var motifs = '';
      for (var i = 0; i < 26; i++) {
        var x = rand(seed, i * 6) * TILE;
        var y = rand(seed, i * 6 + 1) * TILE;
        var r = 12 + rand(seed, i * 6 + 2) * 18;
        motifs += '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')">';
        for (var p = 0; p < 6; p++) {
          var a = (p / 6) * Math.PI * 2;
          motifs +=
            '<ellipse cx="' + (Math.cos(a) * r * 0.45).toFixed(1) +
            '" cy="' + (Math.sin(a) * r * 0.45).toFixed(1) +
            '" rx="' + (r * 0.34).toFixed(1) + '" ry="' + (r * 0.2).toFixed(1) +
            '" fill="' + (p % 2 ? c.high : c.ink) + '" opacity=".32" transform="rotate(' +
            ((a * 180) / Math.PI).toFixed(0) + ')"/>';
        }
        motifs += '<circle r="' + (r * 0.16).toFixed(1) + '" fill="#fff" opacity=".3"/></g>';
      }
      return {
        defs:
          '<pattern id="w" width="6" height="6" patternUnits="userSpaceOnUse">' +
            '<path d="M0 3H6" stroke="' + c.ink + '" stroke-width=".7" opacity=".14"/>' +
          '</pattern>',
        body: fill() + motifs
      };
    }
  };

  function fill() {
    return '<rect width="' + TILE + '" height="' + TILE + '" fill="url(#w)"/>';
  }

  var LABELS = {
    plain: 'Plain knit',
    interlock: 'Interlock',
    matty: 'Matty',
    dot: 'Dot knit',
    'micro-dot': 'Micro dot',
    rice: 'Rice knit',
    honeycomb: 'Honeycomb',
    waffle: 'Waffle',
    mesh: 'Micro mesh',
    terry: 'Terry',
    stripe: 'Striped',
    check: 'Check',
    sparkle: 'Shimmer',
    fleece: 'Soft handle',
    printed: 'Printed'
  };

  KK.weaveLabel = function (weave) {
    return LABELS[weave] || 'Knitted';
  };

  KK.weaveNames = Object.keys(WEAVES);


  /* ======================================================================
     PUBLIC API
     ====================================================================== */

  /**
   * @param {object} o
   * @param {string} o.weave  key of WEAVES (falls back to 'plain')
   * @param {string} o.hex    base cloth colour
   * @param {string} o.seed   stable seed — use the product slug
   * @param {boolean} o.multi render a multi-shade dye lot behind the weave
   * @returns {string} a data: URI ready for src / background-image
   */
  KK.swatch = function (o) {
    o = o || {};
    var weave = o.weave || 'plain';
    var hex = o.hex || '#3D648B';
    var seed = o.seed || 'kk';
    var light = luminance(hex) > 0.55;
    var colours = {
      ink: shift(hex, light ? -0.42 : -0.34),
      high: shift(hex, light ? 0.5 : 0.42)
    };

    var build = WEAVES[weave] || WEAVES.plain;
    var parts = build(colours, seed);

    var base = o.multi
      ? '<linearGradient id="base" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="' + shift(hex, 0.16) + '"/>' +
          '<stop offset=".34" stop-color="' + hex + '"/>' +
          '<stop offset=".62" stop-color="' + shift(hex, -0.22) + '"/>' +
          '<stop offset="1" stop-color="' + shift(hex, 0.08) + '"/>' +
        '</linearGradient>'
      : '<linearGradient id="base" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="' + shift(hex, 0.1) + '"/>' +
          '<stop offset="1" stop-color="' + shift(hex, -0.14) + '"/>' +
        '</linearGradient>';

    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + TILE + ' ' + TILE + '"' +
      ' width="' + TILE + '" height="' + TILE + '" role="presentation">' +
      '<defs>' + base + parts.defs +
        '<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0" stop-color="#fff" stop-opacity=".2"/>' +
          '<stop offset=".42" stop-color="#fff" stop-opacity="0"/>' +
          '<stop offset=".72" stop-color="#000" stop-opacity=".06"/>' +
          '<stop offset="1" stop-color="#000" stop-opacity=".18"/>' +
        '</linearGradient>' +
        '<radialGradient id="vig" cx=".5" cy=".42" r=".78">' +
          '<stop offset=".55" stop-color="#000" stop-opacity="0"/>' +
          '<stop offset="1" stop-color="#000" stop-opacity=".22"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<rect width="' + TILE + '" height="' + TILE + '" fill="url(#base)"/>' +
      parts.body +
      '<rect width="' + TILE + '" height="' + TILE + '" fill="url(#sheen)"/>' +
      '<rect width="' + TILE + '" height="' + TILE + '" fill="url(#vig)"/>' +
      '</svg>';

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  var MULTI = /multi|all colour|all color|multiple/i;

  /** Build swatch options straight from a product or category record. */
  KK.swatchFor = function (item) {
    return KK.swatch({
      weave: item.weave,
      hex: item.hex,
      seed: item.slug || item.name || 'kk',
      multi: MULTI.test(item.color || '')
    });
  };

}(window));
