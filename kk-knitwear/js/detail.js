/* ==========================================================================
   K.K KNITWEAR CLUB — detail.js
   --------------------------------------------------------------------------
   Renders one product view on fabric.html from ?p=<slug>.

     • swatch viewer with Bolt / Detail / Macro magnification
       (a pure background-size transition — no reflow, no reload)
     • a thumbnail rail of related constructions
     • the FULL published specification, nothing padded
     • enquiry actions: add to list, get best price, call, WhatsApp
     • an unknown slug renders a recovery view, never a blank page
   ========================================================================== */

(function (window, document) {
  'use strict';

  var KK = window.KK;
  if (!KK) return;

  var esc = KK.esc;

  /* Magnification steps. `size` is the background-size of the cloth layer. */
  var ZOOMS = [
    { value: 'bolt', label: 'Bolt', size: '100%' },
    { value: 'detail', label: 'Detail', size: '210%' },
    { value: 'macro', label: 'Macro', size: '420%' }
  ];

  var APP_ICONS = {
    shirt: 'shirt', activity: 'activity', person: 'person', cap: 'cap',
    sparkle: 'sparkle', sofa: 'sofa', layers: 'layers', tent: 'tent',
    factory: 'factory'
  };


  function notFound(host, slug) {
    document.title = 'Fabric not found — K.K Knitwear Club';
    host.innerHTML =
      '<section class="section">' +
        '<div class="shell" style="max-width:48rem;text-align:center">' +
          '<span class="empty__icon" style="margin-inline:auto">' + KK.icon('compass') + '</span>' +
          '<p class="mono muted" style="margin-top:1.5rem">Off the shade card</p>' +
          '<h1 style="margin-top:1rem">We can&rsquo;t find that fabric</h1>' +
          '<p class="lede" style="margin:1.25rem auto 0">' +
            (slug ? 'Nothing in the catalogue is filed under “' + esc(slug) + '”. ' : '') +
            'The link may be out of date, or the line may have been renamed. The full ' +
            'catalogue is one click away — or tell us the construction you need and ' +
            'we will point you to the right cloth.</p>' +
          '<div class="btn-row" style="justify-content:center;margin-top:2.25rem">' +
            '<a class="btn btn--brass btn--lg" href="fabrics.html">Browse all fabrics</a>' +
            '<a class="btn btn--outline btn--lg" href="contact.html#enquiry">Send an enquiry</a>' +
          '</div>' +
          '<div style="margin-top:3.5rem;padding-top:2.5rem;border-top:1px solid var(--canvas-300)">' +
            '<p class="mono muted">Popular categories</p>' +
            '<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:.625rem;margin-top:1.5rem">' +
              KK.categories.slice(0, 8).map(function (c) {
                return '<a class="chip chip--light" href="fabrics.html?category=' +
                  esc(c.slug) + '" style="display:inline-flex;align-items:center;gap:.625rem;padding:.375rem .875rem .375rem .375rem">' +
                  '<img src="' + KK.swatchFor(c) + '" alt="" aria-hidden="true" ' +
                  'style="width:1.5rem;height:1.5rem;border-radius:50%">' + esc(c.name) + '</a>';
              }).join('') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';
  }


  function render(host, p) {
    var cat = KK.categoryBySlug[p.category];
    var swatch = KK.swatchFor(p);
    var related = KK.related(p, 3);

    document.title = p.name + ' — K.K Knitwear Club';
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', p.name + ' — ' + [
        p.material, p.gsm && p.gsm + ' GSM', p.width, p.moq && 'MOQ ' + p.moq,
        KK.priceLabel(p)
      ].filter(Boolean).join(' · ') + '. Manufactured by K.K Knitwear Club, Ludhiana.');
    }

    /* -- the full published specification, in a fixed order --------------- */
    var specs = [
      ['Material', p.material],
      ['Construction', KK.weaveLabel(p.weave)],
      ['GSM', p.gsm],
      ['Finished width', p.width],
      ['Pattern', p.pattern],
      ['Colour', p.color],
      ['Minimum order', p.moq],
      ['Packing', p.packaging]
    ]
      .concat((p.extras || []).map(function (e) { return [e.label, e.value]; }))
      .concat([
        ['Sample orders', p.sampleOrders == null ? null
          : (p.sampleOrders ? 'Accepted' : 'Not available')],
        ['Country of origin', p.origin]
      ])
      .filter(function (pair) { return pair[1]; });

    var apps = KK.applications.filter(function (a) {
      return p.apps && p.apps.indexOf(a.slug) !== -1;
    });

    var waMsg = 'Hello K.K Knitwear Club, I would like a quotation for ' + p.name +
      (p.gsm ? ' (' + p.gsm + ' GSM' + (p.width ? ', ' + p.width : '') + ')' : '') +
      '. Please share your best rate and MOQ.';

    host.innerHTML =

    /* ── main view ────────────────────────────────────────────────────── */
    '<section class="section section--tight">' +
      '<div class="shell">' +
        '<nav aria-label="Breadcrumb"><ol class="crumbs">' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><span class="crumbs__sep">' + KK.icon('chevron-right') + '</span>' +
            '<a href="fabrics.html">Fabrics</a></li>' +
          '<li><span class="crumbs__sep">' + KK.icon('chevron-right') + '</span>' +
            '<a href="fabrics.html?category=' + esc(p.category) + '">' +
            esc(cat ? cat.name : '') + '</a></li>' +
          '<li><span class="crumbs__sep">' + KK.icon('chevron-right') + '</span>' +
            '<span aria-current="page">' + esc(p.name) + '</span></li>' +
        '</ol></nav>' +

        '<div class="detail" style="margin-top:2rem">' +

          /* ---- viewer ---- */
          '<div><div class="viewer__sticky">' +
            '<div class="viewer__frame">' +
              '<div class="viewer__cloth" role="img" data-cloth ' +
                'aria-label="' + esc(p.name) + ' — ' + esc(KK.weaveLabel(p.weave).toLowerCase()) +
                ' construction, shown at bolt magnification" ' +
                'style="background-image:url(&quot;' + swatch + '&quot;);background-size:100%"></div>' +
              (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) +
                '" loading="lazy" decoding="async" data-fallback="' + swatch +
                '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">' : '') +
              '<div class="viewer__veil"></div>' +
              '<span class="media__tags">' +
                '<span class="tag">' + esc(KK.weaveLabel(p.weave)) + '</span>' +
                (p.sampleOrders ? '<span class="tag tag--key">Samples accepted</span>' : '') +
              '</span>' +
            '</div>' +

            '<div class="viewer__foot">' +
              '<div class="zoom" role="group" aria-label="Swatch magnification">' +
                ZOOMS.map(function (z, i) {
                  return '<button type="button" data-zoom="' + z.size + '" ' +
                    'aria-pressed="' + (i === 0 ? 'true' : 'false') + '" ' +
                    'data-zoom-label="' + esc(z.label.toLowerCase()) + '">' +
                    esc(z.label) + '</button>';
                }).join('') +
              '</div>' +
              '<p class="viewer__hint">Construction rendering.<br>Shade dyed to your approval.</p>' +
            '</div>' +

            (related.length
              ? '<div class="viewer__thumbs">' + related.map(function (r) {
                  return '<a href="fabric.html?p=' + esc(r.slug) + '" ' +
                    'aria-label="' + esc(r.name) + '">' +
                    '<img src="' + KK.swatchFor(r) + '" alt="" aria-hidden="true"></a>';
                }).join('') + '</div>'
              : '') +
          '</div></div>' +

          /* ---- commercial panel ---- */
          '<div>' +
            '<a class="detail__cat link-draw" href="fabrics.html?category=' +
              esc(p.category) + '">' + esc(cat ? cat.name : '') + '</a>' +
            '<h1>' + esc(p.name) + '</h1>' +
            '<p class="detail__blurb">' + esc(p.blurb) + '</p>' +

            '<div class="pricebox">' +
              '<div>' +
                '<p class="pricebox__label">Indicative rate</p>' +
                '<p class="pricebox__value">' + esc(KK.priceValue(p)) + '</p>' +
                (KK.priceUnit(p) ? '<p class="pricebox__unit">' + esc(KK.priceUnit(p)) + '</p>' : '') +
              '</div>' +
              (p.moq
                ? '<div class="pricebox__moq">' +
                    '<p class="pricebox__label">Minimum order</p>' +
                    '<p class="pricebox__value">' + esc(p.moq) + '</p></div>'
                : '') +
            '</div>' +

            '<div class="btn-row" style="margin-top:1.5rem">' +
              '<button type="button" class="btn btn--brass btn--lg add-btn-lg" data-add="' +
                esc(p.slug) + '" aria-pressed="false">' +
                '<span class="add-btn__off">' + KK.icon('plus') + 'Add to enquiry list</span>' +
                '<span class="add-btn__on">' + KK.icon('check') + 'On your enquiry list</span>' +
              '</button>' +
              '<a class="btn btn--outline btn--lg" href="contact.html#enquiry">' +
                KK.icon('rupee') + 'Get best price</a>' +
              '<a class="btn btn--whatsapp btn--lg" data-wa data-wa-msg="' + esc(waMsg) + '" href="#">' +
                KK.icon('whatsapp') + 'WhatsApp</a>' +
            '</div>' +

            '<p class="detail__note">Rates are indicative and confirmed against quantity, ' +
              'shade and finish. Or call <a class="link-draw" href="tel:' +
              esc(KK.company.phoneDial) + '" style="font-weight:500;color:var(--ink-700)">' +
              esc(KK.company.phoneDisplay) + '</a>.</p>' +

            '<div class="detail__block">' +
              '<h2>Published specification</h2>' +
              '<dl class="spec-table">' + specs.map(function (pair) {
                return '<div class="spec-row"><dt>' + esc(pair[0]) + '</dt>' +
                  '<dd' + (pair[0] === 'GSTIN' ? ' class="is-mono"' : '') + '>' +
                  esc(pair[1]) + '</dd></div>';
              }).join('') + '</dl>' +
            '</div>' +

            ((p.usage && p.usage.length) || apps.length
              ? '<div class="detail__block">' +
                  '<h2>Applications</h2>' +
                  (p.usage && p.usage.length
                    ? '<p style="font-size:var(--fs-sm);line-height:1.7;color:var(--ink-600)">' +
                      'Published usage: ' + esc(p.usage.join(', ')) + '.</p>' : '') +
                  (apps.length
                    ? '<div class="chips" style="margin-top:1rem">' + apps.map(function (a) {
                        return '<a class="chip chip--light" href="fabrics.html?application=' +
                          esc(a.slug) + '" style="display:inline-flex;align-items:center;gap:.5rem">' +
                          KK.icon(APP_ICONS[a.icon] || a.icon) + esc(a.name) + '</a>';
                      }).join('') + '</div>' : '') +
                '</div>'
              : '') +

            '<div class="detail__block"><h2>Trade terms</h2>' +
              '<div class="terms">' +
                '<div class="term">' + KK.icon('package') +
                  '<p class="term__k">Packing</p><p class="term__v">' +
                  esc(p.packaging || 'Rolls / than / packet') + '</p></div>' +
                '<div class="term">' + KK.icon('truck') +
                  '<p class="term__k">Dispatch</p><p class="term__v">' +
                  esc(KK.company.shipmentMode) + '</p></div>' +
                '<div class="term">' + KK.icon('shield') +
                  '<p class="term__k">Seller</p><p class="term__v">' +
                  esc(KK.company.natureOfBusiness) + ', est. ' + KK.company.established +
                  '</p></div>' +
              '</div>' +
            '</div>' +

          '</div>' +
        '</div>' +
      '</div>' +
    '</section>' +

    /* ── related ──────────────────────────────────────────────────────── */
    (related.length
      ? '<section class="section section--white section--tight" style="border-top:1px solid var(--canvas-300)">' +
          '<div class="shell">' +
            '<div class="section__head section__head--split">' +
              '<div><span class="badge badge--loom">Related constructions</span>' +
                '<h2 style="margin-top:1rem">Others in ' +
                esc((cat ? cat.name : 'the catalogue').toLowerCase()) + '</h2></div>' +
              '<a class="btn btn--outline" href="fabrics.html?category=' + esc(p.category) + '">' +
                'View category ' + KK.icon('arrow-right') + '</a>' +
            '</div>' +
            '<div class="product-grid">' + related.map(KK.productCardHtml).join('') + '</div>' +
          '</div>' +
        '</section>'
      : '') +

    /* ── closing enquiry band ─────────────────────────────────────────── */
    '<section class="enquire-band">' +
      '<div class="tex tex--twill-light" style="opacity:.7"></div>' +
      '<div class="shell enquire-band__inner">' +
        '<div>' +
          '<h2>Want ' + esc(p.name) + ' in your shade and quantity?</h2>' +
          '<p>Send the quantity and shade you need. We&rsquo;ll confirm the rate ' +
            'against your order.</p>' +
        '</div>' +
        '<div class="btn-row">' +
          '<a class="btn btn--brass btn--lg" href="contact.html#enquiry">Request a Quote</a>' +
          '<a class="btn btn--ghost btn--lg" href="tel:' + esc(KK.company.phoneDial) + '">' +
            KK.icon('phone') + esc(KK.company.phoneDisplay) + '</a>' +
        '</div>' +
      '</div>' +
    '</section>';

    /* -- zoom control ---------------------------------------------------- */
    var cloth = host.querySelector('[data-cloth]');
    host.querySelectorAll('[data-zoom]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        cloth.style.backgroundSize = btn.dataset.zoom;
        cloth.setAttribute('aria-label',
          p.name + ' — ' + KK.weaveLabel(p.weave).toLowerCase() +
          ' construction, shown at ' + btn.dataset.zoomLabel + ' magnification');
        host.querySelectorAll('[data-zoom]').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
      });
    });
  }


  function start() {
    var host = document.querySelector('[data-detail]');
    if (!host) return;
    var slug = new URLSearchParams(location.search).get('p');
    var product = slug && KK.productBySlug[slug];

    if (!product) { notFound(host, slug); return; }
    render(host, product);

    /* app.js owns the enquiry buttons and WhatsApp links — refresh both now
       that this page's markup exists. */
    document.dispatchEvent(new CustomEvent('kk:rendered'));
    if (KK.observeReveal) KK.observeReveal(host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

}(window, document));
