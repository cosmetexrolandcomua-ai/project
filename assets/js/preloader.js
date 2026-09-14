/* =========================================================================
   Preloader: the percentage meter, the drifting image tiles, and the hero
   card that expands into the page once loading completes.

   Shown once per browsing session so repeat navigation is not punished.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { qs, qsa, clamp, emit, reducedMotion } = NY.util;
  const SESSION_KEY = 'nymphai:seen-intro';
  const MIN_DURATION = 1700;
  const MAX_DURATION = 4200;

  function seen() {
    try { return window.sessionStorage.getItem(SESSION_KEY) === '1'; }
    catch (err) { return false; }
  }
  function markSeen() {
    try { window.sessionStorage.setItem(SESSION_KEY, '1'); } catch (err) { /* ignore */ }
  }

  function init() {
    const el = qs('.preloader');
    if (!el) { emit('preloader:done'); return; }

    const force = new URLSearchParams(window.location.search).has('intro');

    if ((seen() && !force) || reducedMotion()) {
      el.remove();
      document.body.dataset.intro = 'skipped';
      markSeen();
      emit('preloader:done');
      return;
    }

    document.body.dataset.intro = 'running';
    const meterTicks = qs('.preloader__meter .rail__ticks', el);
    const meterValue = qs('.preloader__meter .rail__value', el);
    const tiles = qsa('.preloader__tile', el);
    const cta = qs('.preloader__cta', el);

    tiles.forEach((tile, i) => {
      setTimeout(() => { tile.dataset.in = 'true'; }, 120 + i * 130);
    });
    setTimeout(() => { el.dataset.stage = 'revealed'; }, 160);

    /* Real asset progress, floored by a minimum on-screen time so the meter
       never flashes past on a warm cache. */
    const images = Array.from(document.images);
    let loaded = images.filter((img) => img.complete).length;
    images.forEach((img) => {
      if (img.complete) return;
      const done = () => { loaded += 1; };
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });

    const start = performance.now();
    let shown = 0;
    let finished = false;

    const stop = NY.ticker.add((now) => {
      const elapsed = now - start;
      const assets = images.length ? loaded / images.length : 1;
      const timeFloor = clamp(elapsed / MIN_DURATION, 0, 1);
      const forced = elapsed >= MAX_DURATION ? 1 : 0;
      const real = Math.max(Math.min(assets, timeFloor), forced);

      shown = Math.max(shown, shown + (real - shown) * 0.13);
      if (real >= 1 && shown > 0.99) shown = 1;

      const pct = Math.round(shown * 100);
      if (meterTicks) meterTicks.style.setProperty('--rail-progress', shown.toFixed(4));
      if (meterValue) meterValue.textContent = `${pct}%`;

      if (shown >= 1 && !finished) { finished = true; stop(); complete(); }
    });

    function complete() {
      el.dataset.stage = 'expanding';
      setTimeout(() => {
        el.classList.add('is-leaving');
        setTimeout(() => {
          el.remove();
          document.body.dataset.intro = 'done';
          markSeen();
          emit('preloader:done');
        }, 620);
      }, 900);
    }

    if (cta) {
      cta.addEventListener('click', (e) => {
        e.preventDefault();
        if (finished) return;
        finished = true;
        stop();
        if (meterValue) meterValue.textContent = '100%';
        if (meterTicks) meterTicks.style.setProperty('--rail-progress', '1');
        complete();
      });
    }
  }

  NY.preloader = { init };
})(window.NY);
