/* ==========================================================================
   K.K KNITWEAR CLUB — hero3d.js
   --------------------------------------------------------------------------
   The one deliberate 3D moment on the site: three bolts of cloth in the hero.

   Each bolt is a real cylinder built from N thin panels rotated around a
   shared Y axis inside a `transform-style: preserve-3d` stage, capped with an
   elliptical roll end and a brass core tube. Every panel carries the same
   procedural weave texture used on the product cards, so the 3D piece shows
   the mill's ACTUAL constructions rather than a generic prop.

   No Three.js, no WebGL, no download cost — which is why it can be here at
   all on a site that has to stay fast.

   It mounts only when:
     • the viewport is at least 900px wide, AND
     • the visitor has not asked for reduced motion, AND
     • the browser supports 3D transforms.
   Otherwise the flat composition in .stage__flat (same textures) is shown.
   ========================================================================== */

(function (window, document) {
  'use strict';

  var KK = window.KK;
  if (!KK) return;

  /* The three constructions on show, named in the caption beneath the stage. */
  var BOLTS = [
    {
      weave: 'dot', hex: '#243d59', seed: 'bolt-dot',
      left: 18, width: 21, height: 58, tilt: 2.2, speed: 0.030
    },
    {
      weave: 'honeycomb', hex: '#b78a42', seed: 'bolt-honeycomb',
      left: 39, width: 25, height: 76, tilt: -1.1, speed: -0.022
    },
    {
      weave: 'matty', hex: '#3d648b', seed: 'bolt-matty',
      left: 65, width: 19, height: 51, tilt: -2.8, speed: 0.026
    }
  ];

  var PANELS = 18;               /* panels per cylinder */
  var SEAM_OVERLAP = 1.08;       /* widen panels slightly so seams don't show */

  function supports3D() {
    var el = document.createElement('div');
    el.style.transformStyle = 'preserve-3d';
    return el.style.transformStyle === 'preserve-3d';
  }

  /**
   * The flat composition. A cylindrical shading gradient over the same weave
   * texture is what makes a plain rectangle read as a bolt of cloth.
   */
  function buildFlat(flat) {
    if (!flat || flat.dataset.built) return;
    flat.dataset.built = '1';
    flat.innerHTML = BOLTS.map(function (cfg) {
      var texture = KK.swatch({ weave: cfg.weave, hex: cfg.hex, seed: cfg.seed });
      return '<div class="flat-bolt" style="' +
        'left:' + cfg.left + '%;' +
        'width:' + cfg.width + '%;' +
        'height:' + cfg.height + '%;' +
        'transform:rotate(' + cfg.tilt + 'deg);' +
        'transform-origin:bottom center;' +
        'background-image:url(&quot;' + texture + '&quot;)"></div>';
    }).join('');
  }

  function build() {
    var scene = document.querySelector('.stage__scene');
    var world = scene && scene.querySelector('.stage__world');
    var flat = document.querySelector('.stage__flat');
    buildFlat(flat);
    if (!scene || !world) return;

    var use3D = KK.DESKTOP.matches &&
                !KK.REDUCED_MOTION.matches &&
                supports3D();

    scene.hidden = !use3D;
    if (flat) flat.hidden = use3D;
    if (!use3D) { world.innerHTML = ''; return; }

    var rect = scene.getBoundingClientRect();
    if (!rect.width) return;

    world.innerHTML = '';

    var built = BOLTS.map(function (cfg) {
      var w = (cfg.width / 100) * rect.width;
      var h = (cfg.height / 100) * rect.height;
      var r = w / 2;
      var texture = KK.swatch({ weave: cfg.weave, hex: cfg.hex, seed: cfg.seed });

      var bolt = document.createElement('div');
      bolt.className = 'bolt';
      bolt.style.left = cfg.left + '%';
      bolt.style.width = w + 'px';
      bolt.style.height = h + 'px';

      /* -- the cylinder wall: N panels around a shared axis -------------- */
      var chord = ((2 * Math.PI * r) / PANELS) * SEAM_OVERLAP;
      for (var i = 0; i < PANELS; i++) {
        var panel = document.createElement('div');
        panel.className = 'bolt__panel';
        panel.style.width = chord + 'px';
        panel.style.left = (w / 2 - chord / 2) + 'px';
        panel.style.right = 'auto';
        panel.style.backgroundImage = 'url("' + texture + '")';
        panel.style.backgroundSize = (w * 1.3) + 'px auto';
        panel.style.backgroundPosition = (-i * chord) + 'px 0';
        panel.style.transform =
          'rotateY(' + (i * (360 / PANELS)) + 'deg) translateZ(' + r + 'px)';
        bolt.appendChild(panel);
      }

      /* -- the wound end of the roll ------------------------------------ */
      var cap = document.createElement('div');
      cap.className = 'bolt__cap';
      cap.style.width = w + 'px';
      cap.style.height = w + 'px';
      cap.style.top = (-w / 2) + 'px';
      cap.style.marginLeft = (-w / 2) + 'px';
      cap.style.background =
        'repeating-radial-gradient(circle at 50% 50%, ' + cfg.hex + ' 0 3px, ' +
        'rgba(8,13,17,.55) 3px 6px)';
      cap.style.transform = 'rotateX(90deg)';
      bolt.appendChild(cap);

      /* -- brass core tube ---------------------------------------------- */
      var core = document.createElement('div');
      core.className = 'bolt__core';
      core.style.width = (w * 0.16) + 'px';
      core.style.height = (w * 0.3) + 'px';
      core.style.top = (-w * 0.28) + 'px';
      core.style.marginLeft = (-w * 0.08) + 'px';
      bolt.appendChild(core);

      world.appendChild(bolt);
      return { el: bolt, cfg: cfg, spin: Math.random() * 360 };
    });

    /* ------------------------------------------------------------------
       One rAF loop drives the whole stage: a very slow turn per bolt so the
       weave is legible in the round, plus damped pointer parallax on the
       world. The damping is frame-rate independent.
       ------------------------------------------------------------------ */
    var pointer = { x: 0, y: 0 };
    var current = { x: 0, y: 0 };
    var last = 0;
    var running = true;

    function onPointer(e) {
      var r = scene.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }
    window.addEventListener('pointermove', onPointer, { passive: true });

    /* Stop the loop while the hero is off-screen — no wasted frames. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) { last = 0; requestAnimationFrame(frame); }
      }, { threshold: 0 }).observe(scene);
    }

    function frame(now) {
      if (!running) return;
      var dt = last ? Math.min((now - last) / 16.667, 3) : 1;
      last = now;

      var k = 1 - Math.pow(0.86, dt);
      current.x += (pointer.x - current.x) * k;
      current.y += (pointer.y - current.y) * k;

      world.style.transform =
        'rotateX(' + (-current.y * 6).toFixed(2) + 'deg) ' +
        'rotateY(' + (current.x * 13).toFixed(2) + 'deg)';

      built.forEach(function (b) {
        b.spin += b.cfg.speed * dt;
        b.el.style.transform =
          'rotateZ(' + b.cfg.tilt + 'deg) rotateY(' + b.spin.toFixed(2) + 'deg)';
      });

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* Rebuild on resize (debounced) and whenever the media queries flip. */
  var timer;
  function rebuild() {
    clearTimeout(timer);
    timer = setTimeout(build, 200);
  }

  function start() {
    build();
    window.addEventListener('resize', rebuild);
    KK.DESKTOP.addEventListener('change', build);
    KK.REDUCED_MOTION.addEventListener('change', build);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

}(window, document));
