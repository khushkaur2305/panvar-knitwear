# K.K Knitwear Club — B2B fabric sourcing site

A premium front end for **K.K Knitwear Club**, a polyester and knitted fabric
manufacturer operating in Ludhiana, Punjab since 1990.

Built for one journey — **Discover → Explore → Trust → Enquire → Get Quote** —
and for one audience: garment manufacturers, clothing brands, wholesalers,
exporters, retailers and bulk fabric buyers. Deliberately not a consumer
fashion store.

**Plain HTML, CSS and JavaScript.** No framework, no build step, no npm
dependencies. Upload the folder to any static host and it runs.

---

## Running it locally

```bash
node serve.js
```

Then open <http://localhost:5178>. Pass a port to change it: `node serve.js 3000`.

`serve.js` is a ~50-line dependency-free static server, there purely so the
pages can be opened over `http://` (which keeps `localStorage`, query strings
and relative links behaving exactly as they will in production). It is **not**
needed on the host — deploy the folder as-is.

You can also open `index.html` straight from disk; everything works except the
enquiry list, which needs an origin to persist to.

---

## Files

```
index.html      Homepage — hero → trust → categories → featured → how we work
                → applications → infrastructure → testimonials → request quote
                ("How we work" merges the former Why Choose Us and
                 Manufacturing Process sections: four reasons, six steps and
                 the capability envelope in one dark band.)
fabrics.html    Catalogue: search, faceted filters, sort, grid/list views
fabric.html     Product detail, driven by ?p=<slug>
about.html      Company · why choose us · manufacturing · infrastructure · gallery
contact.html    Address, location, company record, full enquiry form

css/style.css   The shared stylesheet. Numbered contents table at the top;
                brand colours are the tokens in section 01.
css/home.css    The warm greige layer — index.html ONLY. See "Two design
                directions" below.

js/data.js      THE SOURCE OF TRUTH — company record, 15 categories,
                48 products, applications, capability
js/swatch.js    Procedural fabric-swatch renderer (15 weave families → data URIs)
js/app.js       Shared behaviour: header, drawers, reveals, enquiry list,
                enquiry form, WhatsApp links, dynamic lists
js/home.js      Homepage collections (categories, featured, applications)
js/catalogue.js fabrics.html — filtering, sorting, rendering
js/detail.js    fabric.html — one product view from the query string
js/about.js     about.html — weave strip and gallery
js/hero3d.js    index.html — the CSS-3D fabric bolts

serve.js        Local static server (not needed in production)
assets/         favicon
```

Scripts load with `defer` in dependency order: `data → swatch → app → page`.

---

## Content is sourced, not invented

**Every company fact and product specification on this site is transcribed from
K.K Knitwear Club's own published listings.** Nothing is estimated, embellished
or filled in.

Sources:

- <https://www.kkknitwearclub.com/> — home plus one page per category
- <https://www.indiamart.com/kkknitwearclub/profile.html> — company profile
- <https://www.instagram.com/kkknitwearclub/>

If you add or edit a product in `js/data.js`, keep the same discipline: **leave
a field out rather than guess it.** A missing field simply doesn't render.

Prices are the published "Approx." rates and are surfaced everywhere as
indicative — `≈ ₹210 / kg · indicative` — never as a firm quote.

The capability figures on the homepage and About page (**80–250 GSM**,
**31–60 inch**) are *derived*: they are the lowest and highest values that appear
on any published line, and the pages say so. Gauge 24 and yarn count 100–150
come from the Rice Knit listing alone.

### Testimonials — currently a placeholder template

`index.html` carries a fully styled testimonials section whose three cards are
**deliberately, visibly empty** — literal `[ Client quote — to be supplied ]`
prompts, a dashed border, a hatched background and a "Coming soon" badge. The
company has not published any client quotes, and inventing them would put
fabricated endorsements in front of real buyers.

**To go live with real testimonials:**

1. Replace the `[ … ]` text in each `<figure class="testimonial">` with a real,
   attributable quote, contact name, firm and city.
2. Remove `is-placeholder` and `data-placeholder="true"` from each card.
3. Delete the `<span class="badge">Coming soon</span>` from the section eyebrow.
4. Delete the `<p class="testimonials__note">` block beneath the rail.

Until then the note beneath the rail carries the checkable facts instead, so the
section still does trust-building work.

---

## Imagery — procedural weave swatches

There is no licensed photo library for this business, and generic stock
photography would misrepresent the actual cloth. So `js/swatch.js` **draws each
fabric's construction** — plain, interlock, matty, dot, micro dot, rice,
honeycomb, waffle, mesh, terry, stripe, check, sparkle, soft-handle and printed —
as a deterministic SVG texture in the product's published colour, returned as a
data URI.

That means no network requests, no CORS, no layout shift, no licensing question,
and imagery that is actually informative: a buyer can see a waffle apart from a
honeycomb. The same generator feeds the product cards, category tiles, the
gallery, the detail-page magnifier and the 3D bolts, so the visual system stays
coherent.

**To swap in real photography** for any product, add one field in `js/data.js`:

```js
{
  slug: 'rice-knit-fabric',
  image: 'assets/products/rice-knit-fabric.jpg',   // put the file here
  …
}
```

The card and detail renderers then prefer the photograph, lazy-load it, and fall
back to the swatch automatically if the file is missing or fails to load. No
other change is needed.

---

## The WhatsApp number — one line to change

Every WhatsApp button on every page is built from a single constant at the top
of `js/app.js`:

```js
var WHATSAPP_NUMBER = '917942802251';   // digits only, country code, no +
```

It is seeded with the company's published number (079 4280 2251). **Confirm that
line accepts WhatsApp before launch** — it is listed as a business enquiry
number, and if the firm uses a different mobile for WhatsApp, replace the digits
here and nothing else.

Plain phone links are ordinary `tel:` hrefs in the HTML and use the same number.

### The enquiry form has no backend — and doesn't pretend to

`js/app.js → initEnquiryForm()` validates the form, then builds two things: a
**pre-filled WhatsApp message** and a **copyable plain-text summary**, both
including every fabric on the buyer's enquiry list with its GSM, width, MOQ and
rate. It never claims to have transmitted anything it has not.

To add server-side submission later, POST the same payload from the submit
handler before showing the result panel.

---

## Two design directions

The site currently runs **two palettes on purpose**:

| | Palette | Pages |
| --- | --- | --- |
| Shared | Cool industrial — blue-black ink, mill indigo, brass | fabrics · fabric · about · contact |
| Homepage | **Warm greige** — umber, oat & sand, clay | index.html |

`index.html` loads `css/style.css` and then `css/home.css`, which redefines the
same tokens in warm values. Because style.css is fully token-driven, that one
extra file reskins the whole homepage — header, cards, dark sections, footer,
drawers, action bar — without touching any markup or any other page.

Two things the token swap alone cannot do, both handled in `home.css`:

- **Contrast.** Brass was light, so style.css pairs it with dark text. Clay is
  dark, so `.btn--brass`, `.tag--key`, `.badge--brass` and `.enquiry-btn__count`
  are given light text. Measured 4.96:1. A lighter clay was tried first and
  failed at 4.11:1 — **re-measure if you retune the accent.**
- **Hardcoded cool `rgba()`.** style.css bakes a blue-black `(8,13,17)` into its
  veils, scrims and translucent grounds; section 03 of `home.css` restates each
  one in warm umber `(20,14,9)`.

`--loom-*` (mill indigo) is deliberately *not* overridden: the fabric swatch
colours live in `js/data.js` and are shared by every page, so indigo is what ties
the oat grounds to the indigo and teal cloth. That pairing — raw greige and
indigo dye — is the point of the direction.

**To make the whole site warm:** copy sections 01 and 02 of `home.css` into
`css/style.css`, then delete `home.css` and its `<link>` from `index.html`.

**To revert the homepage:** delete the `home.css` `<link>` from `index.html`
(one line), and restore the plain Fraunces request on the line above it.

`js/hero3d.js` is loaded only by `index.html`, so the three fabric bolts are
tinted warm there directly (indigo · clay · muted blue-grey).

---

## Design system

Everything is driven by the tokens in **section 01 of `css/style.css`** — and,
on the homepage, overridden by section 01 of `css/home.css`. Change them there
and everything follows.

| Token family | Role |
| --- | --- |
| `--ink-*` | Near-black slate — header, dark sections, footer |
| `--loom-*` | Mill indigo — primary accent, links, eyebrows |
| `--brass-*` | Machinery brass — **reserved for Request a Quote** and one highlight per section, so the primary action never competes with itself |
| `--canvas-*` | Raw greige cloth — page and card surfaces |

**Type** — Fraunces (display), Inter (body), IBM Plex Mono (specifications,
labels, eyebrows). Specs are set in mono throughout so GSM, width and MOQ read as
technical data rather than marketing copy.

**Texture** — `.tex--twill`, `.tex--warp-light` and `.tex--grid` overlay a woven
thread pattern at ~5% opacity, edge-masked so it never reads as tiling.

**Motion** — one easing curve (`--ease-silk`), 14px of reveal travel, once only.
Everything degrades under `prefers-reduced-motion: reduce`.

Layout is mobile-first with breakpoints at 640px, **900px (the desktop switch)**
and 1200px.

---

## The 3D element

`js/hero3d.js` builds three bolts of cloth in the hero. Each is a real cylinder:
18 thin panels positioned with `rotateY(i·20°) translateZ(r)` inside a
`transform-style: preserve-3d` stage, capped with an elliptical roll end and a
brass core tube, every panel carrying the same procedural weave texture used on
the product cards.

No Three.js, no WebGL, no download cost — which is why it can be there at all on
a site that has to stay fast. A single `requestAnimationFrame` loop drives a very
slow turn per bolt plus frame-rate-independent damped pointer parallax, and it
stops entirely while the hero is off-screen.

It mounts only at ≥900px, with motion allowed, and where 3D transforms are
supported. Everything else gets the flat composition in `.stage__flat` — same
textures, no cost.

---

## Accessibility

- Skip link, landmark regions, one visible `:focus-visible` ring site-wide.
- Drawers (mobile nav, enquiry list, mobile filters) trap focus, lock body
  scroll, and close on Escape or backdrop click.
- Toggles expose `aria-pressed`; the catalogue result count is `aria-live`.
- Form errors use `role="alert"` and `aria-invalid`, and focus moves to the
  first invalid field on submit.
- Decorative textures and swatch backdrops are `aria-hidden`; informative
  swatches carry a construction description in their `alt` text.

## Catalogue URLs

All filter state lives in the query string, so any filtered view is linkable:

```
fabrics.html?category=dot-knit-fabrics
fabrics.html?application=sportswear&gsm=160-200&sort=price-asc
fabrics.html?q=matty&view=list
fabric.html?p=rice-knit-fabric
```

Facet counts are computed by excluding the dimension being counted, so each
number honestly answers *"how many if I also pick this"*.
