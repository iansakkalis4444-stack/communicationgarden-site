(function () {
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.getElementById('nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Subtle scroll-draw flower (~1KB) */
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
      var vh = window.innerHeight || 1;
      /* draw as flower enters lower viewport → settles mid */
      var start = vh * 0.92;
      var end = vh * 0.38;
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
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();
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
