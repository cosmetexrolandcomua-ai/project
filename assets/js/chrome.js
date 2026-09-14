/* =========================================================================
   Persistent chrome behaviour: custom cursor, scroll rail, chrome inversion
   over dark media, cart badge, and the toast used for cart feedback.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { qs, qsa, clamp, lerp, isCoarse, reducedMotion } = NY.util;

  /* ---------------------------------------------------------------- cursor */

  function initCursor() {
    if (isCoarse() || reducedMotion()) return;
    const el = qs('.cursor');
    if (!el) return;
    const label = qs('.cursor__label', el);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    window.addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      el.dataset.active = 'true';
    }, { passive: true });

    document.addEventListener('pointerleave', () => { el.dataset.active = 'false'; });

    // Hover state is resolved on the fly so it also covers nodes injected later.
    document.addEventListener('pointerover', (e) => {
      const target = e.target.closest('a, button, [data-cursor], input, textarea, select');
      if (!target) { el.dataset.state = ''; if (label) label.textContent = ''; return; }
      const text = target.dataset ? target.dataset.cursorLabel : '';
      if (text) {
        if (label) label.textContent = text;
        el.dataset.state = 'label';
      } else {
        el.dataset.state = 'hover';
      }
    });

    NY.ticker.add(() => {
      x = lerp(x, tx, 0.18);
      y = lerp(y, ty, 0.18);
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    });
  }

  /* ------------------------------------------------------------------ rail */

  function initRail() {
    const rail = qs('.rail');
    if (!rail) return;
    const ticks = qs('.rail__ticks', rail);
    const value = qs('.rail__value', rail);
    let shown = 0;

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      shown = lerp(shown, progress, 0.12);
      if (Math.abs(shown - progress) < 0.0005) shown = progress;
      ticks.style.setProperty('--rail-progress', shown.toFixed(4));
      value.textContent = `${Math.round(shown * 100)}%`;
    }

    NY.ticker.add(update);
    update();
    rail.dataset.visible = 'true';
  }

  /* ------------------------------------------------- chrome colour inversion */

  /* Sections declare `data-chrome="light"` when they carry dark media behind the
     frame. Whichever one owns the vertical centre of the viewport wins. */
  function initChromeTheme() {
    // <html> also carries data-chrome as the pre-JS default, and it always
    // spans the viewport — so it has to be excluded or it wins every time.
    const root = document.documentElement;
    const zones = qsa('[data-chrome]').filter((el) => el !== root);
    if (!zones.length) { root.dataset.chrome = 'dark'; return; }

    let current = '';
    function update() {
      const mid = window.innerHeight / 2;
      let next = 'dark';
      for (let i = 0; i < zones.length; i += 1) {
        const r = zones[i].getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) { next = zones[i].dataset.chrome; break; }
      }
      if (next !== current) { current = next; root.dataset.chrome = next; }
    }

    NY.ticker.add(update);
    update();
  }

  /* ------------------------------------------------------------ cart badge */

  function initCartBadge() {
    const links = qsa('.cart-link');
    if (!links.length) return;
    function paint() {
      const n = NY.cart.count();
      links.forEach((link) => {
        link.dataset.filled = n > 0 ? 'true' : 'false';
        const out = qs('.cart-link__count span', link);
        if (out) out.textContent = String(n);
      });
    }
    document.addEventListener('cart:change', paint);
    paint();
  }

  /* ---------------------------------------------------------------- toast */

  let toastTimer;
  function toast(message) {
    let el = qs('.notice');
    if (!el) {
      el = document.createElement('div');
      el.className = 'notice';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.dataset.show = 'true';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.dataset.show = 'false'; }, 2600);
  }

  NY.chrome = { initCursor, initRail, initChromeTheme, initCartBadge, toast };
})(window.NY);
