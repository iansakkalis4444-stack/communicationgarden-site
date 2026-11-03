(function () {
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.getElementById('nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Desktop "What we treat" dropdown: hover/focus via CSS; click toggles; Esc / outside closes */
  (function navDropdown() {
    var item = document.querySelector('.nav-desktop .has-dropdown');
    if (!item) return;
    var trigger = item.querySelector('.nav-dropdown-trigger');
    var menu = item.querySelector('.nav-dropdown');
    if (!trigger || !menu) return;

    function setOpen(open) {
      item.classList.toggle('is-open', !!open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    trigger.addEventListener('click', function (e) {
      /* First click/tap opens; when already open, follow the link to /what-we-treat/ */
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      if (trigger.getAttribute('aria-expanded') !== 'true') {
        e.preventDefault();
        setOpen(true);
      }
    });

    item.addEventListener('mouseenter', function () { setOpen(true); });
    item.addEventListener('mouseleave', function () { setOpen(false); });

    document.addEventListener('click', function (e) {
      if (!item.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        trigger.focus();
      }
    });

    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) setOpen(false);
    });
  })();

  /* Subtle scroll-draw flower (~1.5KB); works on iOS Safari + mobile */
  (function growFlower() {
    var svg = document.querySelector('.grow-flower');
    if (!svg) return;
    var paths = svg.querySelectorAll('.gf-path');
    if (!paths.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stages = [
      { sel: '.gf-stem', a: 0, b: 0.38 },
      { sel: '.gf-leaf-l', a: 0.32, b: 0.62 },
      { sel: '.gf-leaf-r', a: 0.38, b: 0.68 },
      { sel: '.gf-bloom', a: 0.58, b: 0.9 },
      { sel: '.gf-center', a: 0.82, b: 1 }
    ];
    function setProgress(p) {
      for (var i = 0; i < stages.length; i++) {
        var s = stages[i];
        var el = svg.querySelector(s.sel);
        if (!el) continue;
        var t = (p - s.a) / (s.b - s.a);
        if (t < 0) t = 0; else if (t > 1) t = 1;
        el.style.strokeDashoffset = String(100 - t * 100);
      }
    }
    if (reduce) {
      svg.classList.add('is-static');
      setProgress(1);
      return;
    }
    var ticking = false;
    function measure() {
      var rect = svg.getBoundingClientRect();
      var vh = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 1;
      /* draw as flower enters lower viewport → settles mid */
      var start = vh * 0.92;
      var end = vh * 0.42;
      var p = (start - rect.top) / (start - end);
      if (p < 0) p = 0; else if (p > 1) p = 1;
      setProgress(p);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    }
    var scrollOpts = { passive: true, capture: false };
    window.addEventListener('scroll', onScroll, scrollOpts);
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onScroll, { passive: true });
      window.visualViewport.addEventListener('scroll', onScroll, { passive: true });
    }
    /* IntersectionObserver fallback: drives progress when scroll events are sparse (iOS) */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function () { onScroll(); }, {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      });
      var bloom = document.querySelector('.section-bloom') || svg;
      io.observe(bloom);
    }
    measure();
  })();


  /* Larger side vine: stem draws, leaves + bloom open in sequence */
  (function growVine() {
    var region = document.querySelector('.vine-region');
    if (!region) return;
    var stems = region.querySelectorAll('.gv-stem');
    var leaves = region.querySelectorAll('.gv-leaf-sprite');
    var bloom = region.querySelector('.gv-end-bloom');
    if (!stems.length) return;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var leafStages = [
      { sel: '.scroll-vine--left .gv-leaf-1', a: 0.05, b: 0.16 },
      { sel: '.scroll-vine--left .gv-leaf-2', a: 0.14, b: 0.26 },
      { sel: '.scroll-vine--left .gv-leaf-3', a: 0.24, b: 0.36 },
      { sel: '.scroll-vine--left .gv-leaf-4', a: 0.34, b: 0.46 },
      { sel: '.scroll-vine--left .gv-leaf-5', a: 0.44, b: 0.56 },
      { sel: '.scroll-vine--left .gv-leaf-6', a: 0.54, b: 0.66 },
      { sel: '.scroll-vine--left .gv-leaf-7', a: 0.62, b: 0.74 },
      { sel: '.scroll-vine--right .gv-leaf-1', a: 0.1, b: 0.24 },
      { sel: '.scroll-vine--right .gv-leaf-2', a: 0.22, b: 0.36 },
      { sel: '.scroll-vine--right .gv-leaf-3', a: 0.34, b: 0.48 },
      { sel: '.scroll-vine--right .gv-leaf-4', a: 0.46, b: 0.6 },
      { sel: '.scroll-vine--right .gv-leaf-5', a: 0.58, b: 0.72 }
    ];
    var bloomStages = [
      { sel: '.gv-bloom', a: 0.7, b: 0.88, kind: 'path' },
      { sel: '.gv-petal', a: 0.76, b: 0.94, kind: 'paths' },
      { sel: '.gv-center', a: 0.88, b: 1, kind: 'path' }
    ];
    function clamp01(t) {
      if (t < 0) return 0;
      if (t > 1) return 1;
      return t;
    }
    function setLeaf(g, t) {
      var mirror = g.classList.contains('gv-leaf-sprite--right');
      g.style.opacity = String(t);
      g.style.transform = mirror
        ? ('scale(' + (0.4 + t * 0.6) + ') scaleX(-1)')
        : ('scale(' + (0.4 + t * 0.6) + ')');
      var fill = g.querySelector('.gv-leaf-fill');
      if (fill) fill.style.fillOpacity = String(0.42 * t);
      var lp = g.querySelectorAll('.gv-path');
      for (var j = 0; j < lp.length; j++) {
        lp[j].style.strokeDashoffset = String(100 - t * 100);
      }
    }
    function setProgress(p) {
      var i, s, t, el, nodes, k, g, bt, bg, bf;
      t = clamp01(p / 0.76);
      for (i = 0; i < stems.length; i++) {
        stems[i].style.strokeDashoffset = String(100 - t * 100);
      }
      for (i = 0; i < leafStages.length; i++) {
        s = leafStages[i];
        g = region.querySelector(s.sel);
        if (!g) continue;
        setLeaf(g, clamp01((p - s.a) / (s.b - s.a)));
      }
      if (bloom) {
        bt = clamp01((p - 0.68) / 0.32);
        bloom.style.opacity = String(bt);
        bg = bloom.querySelector('.gv-bloom-g');
        if (bt >= 0.995) {
          bloom.classList.add('is-grown');
          bloom.style.transform = '';
          if (bg) {
            bg.style.opacity = '1';
            bg.style.transform = '';
          }
        } else {
          bloom.classList.remove('is-grown');
          bloom.style.transform = 'scale(' + (0.3 + bt * 0.7) + ')';
          if (bg) {
            bg.style.opacity = String(bt);
            bg.style.transform = 'scale(' + (0.45 + bt * 0.55) + ')';
          }
        }
        bf = bloom.querySelector('.gv-bloom-fill');
        if (bf) bf.style.fillOpacity = String(0.4 * bt);
        for (i = 0; i < bloomStages.length; i++) {
          s = bloomStages[i];
          t = clamp01((p - s.a) / (s.b - s.a));
          if (s.kind === 'paths') {
            nodes = bloom.querySelectorAll(s.sel);
            for (k = 0; k < nodes.length; k++) {
              nodes[k].style.strokeDashoffset = String(100 - t * 100);
            }
          } else {
            el = bloom.querySelector(s.sel);
            if (el) el.style.strokeDashoffset = String(100 - t * 100);
          }
        }
      }
    }
    if (reduce) {
      var ri;
      for (ri = 0; ri < stems.length; ri++) {
        stems[ri].closest('svg').classList.add('is-static');
      }
      for (ri = 0; ri < leaves.length; ri++) leaves[ri].classList.add('is-static');
      if (bloom) bloom.classList.add('is-static');
      setProgress(1);
      return;
    }
    var ticking = false;
    function measure() {
      var rect = region.getBoundingClientRect();
      var vh = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 1;
      var start = vh * 0.78;
      var end = vh * 0.22 - rect.height * 0.7;
      var p = (start - rect.top) / (start - end);
      setProgress(clamp01(p));
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('touchmove', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onScroll, { passive: true });
      window.visualViewport.addEventListener('scroll', onScroll, { passive: true });
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function () { onScroll(); }, {
        root: null,
        rootMargin: '0px',
        threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
      });
      io.observe(region);
    }
    measure();
  })();





  /* Desktop scroll-pop garden + nav/button hover blooms (no libraries) */
  (function popGarden() {
    var desktop = window.matchMedia('(min-width: 900px)');
    if (!desktop.matches) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function daisy(fill, soft, center) {
      return '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<g transform="translate(20 21)">' +
        [0,72,144,216,288].map(function (deg) {
          return '<ellipse cx="0" cy="-9.5" rx="4.6" ry="8.2" fill="' + fill + '" stroke="' + soft + '" stroke-width="0.6" transform="rotate(' + deg + ')"/>';
        }).join('') +
        '<circle r="4.2" fill="' + center + '"/>' +
        '</g></svg>';
    }
    function tulip(fill, soft, stem) {
      return '<svg viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M16 42 C16 30 16 24 16 18" stroke="' + stem + '" stroke-width="1.7" stroke-linecap="round"/>' +
        '<path d="M16 20 C10 18 7 12 8 6 C12 8 14 12 16 18 C18 12 20 8 24 6 C25 12 22 18 16 20 Z" fill="' + fill + '" stroke="' + soft + '" stroke-width="0.7"/>' +
        '<path d="M16 20 C14 14 14 9 16 4 C18 9 18 14 16 20 Z" fill="' + soft + '" opacity="0.85"/>' +
        '</svg>';
    }
    function bud(fill, soft, stem) {
      return '<svg viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M14 34 C14 26 14 22 14 16" stroke="' + stem + '" stroke-width="1.5" stroke-linecap="round"/>' +
        '<ellipse cx="14" cy="12" rx="6.2" ry="8" fill="' + fill + '" stroke="' + soft + '" stroke-width="0.7"/>' +
        '<path d="M14 18 C9 16 7 12 8 8" stroke="' + stem + '" stroke-width="1.2" stroke-linecap="round" fill="none"/>' +
        '</svg>';
    }

    var C = {
      pink: ['#E87888', '#F4A3AE', '#F5D076'],
      blue: ['#7BA8C9', '#A9C9DE', '#F5D076'],
      yellow: ['#E8C96A', '#F3DEA0', '#E87888'],
      green: ['#8FB07A', '#B5CFA5', '#F5D076']
    };
    var stem = '#57614E';

    var plans = [
      { sel: '.hero', items: [
        { kind: 'daisy', color: 'pink', left: '0.6rem', top: '18%', size: '42px', rot: '-12deg', delay: '0.05s' },
        { kind: 'tulip', color: 'blue', right: '1.1rem', top: '28%', size: '40px', rot: '10deg', delay: '0.18s' },
        { kind: 'bud', color: 'yellow', left: '1.4rem', top: '62%', size: '30px', rot: '-6deg', delay: '0.28s' }
      ]},
      { sel: '.vine-region > section:nth-of-type(1)', items: [
        { kind: 'daisy', color: 'green', right: '0.85rem', top: '16%', size: '36px', rot: '8deg', delay: '0.05s' },
        { kind: 'bud', color: 'pink', left: '0.55rem', top: '48%', size: '28px', rot: '-14deg', delay: '0.16s' },
        { kind: 'tulip', color: 'yellow', right: '1.3rem', top: '70%', size: '38px', rot: '6deg', delay: '0.26s' }
      ]},
      { sel: '.vine-region > section.band', items: [
        { kind: 'daisy', color: 'blue', left: '0.7rem', top: '22%', size: '40px', rot: '-9deg', delay: '0.04s' },
        { kind: 'tulip', color: 'pink', right: '0.9rem', top: '40%', size: '36px', rot: '12deg', delay: '0.15s' },
        { kind: 'bud', color: 'green', left: '1.2rem', top: '72%', size: '28px', rot: '4deg', delay: '0.24s' }
      ]},
      { sel: '.vine-region > section:nth-of-type(3)', items: [
        { kind: 'daisy', color: 'yellow', left: '0.5rem', top: '20%', size: '34px', rot: '-7deg', delay: '0.06s' },
        { kind: 'bud', color: 'blue', right: '0.7rem', top: '35%', size: '26px', rot: '9deg', delay: '0.14s' },
        { kind: 'tulip', color: 'green', right: '1.1rem', top: '68%', size: '40px', rot: '-5deg', delay: '0.22s' }
      ]},
      { sel: '.visit-us', items: [
        { kind: 'daisy', color: 'pink', left: '0.55rem', top: '18%', size: '38px', rot: '7deg', delay: '0.05s' },
        { kind: 'tulip', color: 'blue', right: '0.8rem', top: '55%', size: '36px', rot: '-10deg', delay: '0.18s' }
      ]},
      { sel: 'main > section:last-of-type', items: [
        { kind: 'daisy', color: 'green', left: '1rem', top: '30%', size: '36px', rot: '-8deg', delay: '0.05s' },
        { kind: 'bud', color: 'yellow', right: '1.2rem', top: '40%', size: '28px', rot: '11deg', delay: '0.16s' },
        { kind: 'tulip', color: 'pink', left: '2.2rem', top: '68%', size: '34px', rot: '5deg', delay: '0.24s' }
      ]}
    ];

    function svgFor(item) {
      var c = C[item.color] || C.pink;
      if (item.kind === 'tulip') return tulip(c[0], c[1], stem);
      if (item.kind === 'bud') return bud(c[0], c[1], stem);
      return daisy(c[0], c[1], c[2]);
    }

    var nodes = [];
    plans.forEach(function (plan) {
      var host = document.querySelector(plan.sel);
      if (!host) return;
      plan.items.forEach(function (item) {
        var el = document.createElement('span');
        el.className = 'pop-flower pop-flower--' + item.kind + ' pop-flower--' + item.color;
        el.setAttribute('aria-hidden', 'true');
        if (item.left) el.style.setProperty('--pop-left', item.left);
        if (item.right) el.style.setProperty('--pop-right', item.right);
        if (item.top) el.style.setProperty('--pop-top', item.top);
        if (item.size) el.style.setProperty('--pop-size', item.size);
        if (item.rot) el.style.setProperty('--pop-rot', item.rot);
        if (item.delay) el.style.setProperty('--pop-delay', item.delay);
        el.innerHTML = svgFor(item);
        host.appendChild(el);
        nodes.push(el);
      });
    });

    if (!nodes.length) return;

    if (reduce) {
      nodes.forEach(function (n) { n.classList.add('is-static'); });
      return;
    }

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var section = entry.target;
        section.querySelectorAll('.pop-flower').forEach(function (fl) {
          if (!fl.classList.contains('is-in')) fl.classList.add('is-in');
        });
        io.unobserve(section);
      });
    }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.18 });

    plans.forEach(function (plan) {
      var host = document.querySelector(plan.sel);
      if (host) io.observe(host);
    });
  })();

  (function hoverBlooms() {
    var ok = window.matchMedia('(min-width: 900px) and (hover: hover)').matches;
    if (!ok) return;

    var colors = [
      ['#E87888', '#F4A3AE', '#F5D076'],
      ['#8FB07A', '#B5CFA5', '#F5D076'],
      ['#7BA8C9', '#A9C9DE', '#F5D076'],
      ['#E8C96A', '#F3DEA0', '#E87888']
    ];

    function miniDaisy(c) {
      return '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<g transform="translate(10 11)">' +
        [0,72,144,216,288].map(function (deg) {
          return '<ellipse cx="0" cy="-4.6" rx="2.2" ry="4" fill="' + c[0] + '" transform="rotate(' + deg + ')"/>';
        }).join('') +
        '<circle r="2" fill="' + c[2] + '"/>' +
        '</g></svg>';
    }

    var sels = [
      '.nav-desktop > ul > li > a',
      '.nav-cta.desktop-only',
      '.hero .btn',
      '.cta-final .btn',
      '.service > a',
      '.funding-side > a',
      '.visit-us .btn'
    ];
    var targets = document.querySelectorAll(sels.join(','));
    targets.forEach(function (el, i) {
      if (el.querySelector('.tab-bloom')) return;
      var bloom = document.createElement('span');
      bloom.className = 'tab-bloom';
      bloom.setAttribute('aria-hidden', 'true');
      bloom.innerHTML = miniDaisy(colors[i % colors.length]);
      el.appendChild(bloom);
    });
  })();


  /* Scroll-reveal + soft motion helpers (before form early-return) */
  (function scrollReveal() {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (!('IntersectionObserver' in window)) return;

    var sectionSel = 'main > section, .vine-region > section, .page-hero, .visit-us, .section-bloom, .cta-final';
    var cardSel = '.service, .why article, .team-card, .team-photo, .card, .faq details, .funding-card, .funding-side, .form-card, .hero-card, .prose > *, .section-head';
    var nodes = [];

    document.querySelectorAll(sectionSel).forEach(function (el) {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      nodes.push(el);
    });

    document.querySelectorAll(cardSel).forEach(function (el, i) {
      if (el.classList.contains('reveal')) return;
      /* skip nested prose children that are too noisy */
      if (el.matches('.prose > *') && !el.matches('h2, h3, p, ul')) return;
      el.classList.add('reveal');
      var parent = el.parentElement;
      var siblings = parent ? parent.querySelectorAll(':scope > .reveal, :scope > .service, :scope > .team-card, :scope > article, :scope > .card') : null;
      var idx = 0;
      if (siblings) {
        for (var s = 0; s < siblings.length; s++) {
          if (siblings[s] === el) { idx = s; break; }
        }
      } else {
        idx = i % 4;
      }
      el.style.setProperty('--reveal-delay', Math.min(idx * 0.07, 0.35) + 's');
      nodes.push(el);
    });

    if (!nodes.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0.12 });

    nodes.forEach(function (n) {
      /* already in view on load */
      var rect = n.getBoundingClientRect();
      var vh = window.innerHeight || 800;
      if (rect.top < vh * 0.92 && rect.bottom > 40) {
        n.classList.add('is-in');
      } else {
        io.observe(n);
      }
    });
  })();

  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('[type="submit"]');
  form.addEventListener('submit', function (e) {
    var key = form.querySelector('[name="access_key"]');
    if (!key || !key.value || key.value.indexOf('YOUR_') === 0) {
      e.preventDefault();
      if (status) {
        status.className = 'form-status err';
        status.textContent = 'Online form is not connected yet. Please email info@communicationgarden.ca or call 647-451-0188.';
      }
      return;
    }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
  });
})();
