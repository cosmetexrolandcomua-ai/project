/* =========================================================================
   Motion layer: inertial scrolling, scroll-linked transforms, reveals.

   The smooth scroller drives the *real* document scroll (rather than
   transforming a wrapper) so `position: sticky`, anchor links, find-in-page
   and the browser's own scrollbar all keep working.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { qs, qsa, clamp, lerp, mapRange, isCoarse, reducedMotion } = NY.util;

  /* ------------------------------------------------------- inertial scroll */

  function initSmoothScroll() {
    if (isCoarse() || reducedMotion()) return;

    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    let target = window.scrollY;
    let current = target;
    let animating = false;

    const normalise = (e) => {
      if (e.deltaMode === 1) return e.deltaY * 18;       // lines
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // pages
      return e.deltaY;                                    // pixels
    };

    window.addEventListener('wheel', (e) => {
      if (e.ctrlKey || e.metaKey) return;                 // leave zoom alone
      if (e.target.closest('[data-native-scroll]')) return;
      e.preventDefault();
      target = clamp(target + normalise(e), 0, maxScroll());
      animating = true;
    }, { passive: false });

    // Anything that scrolls the page by other means (keyboard, scrollbar drag,
    // anchor jump) re-seeds the animation so it never fights the browser.
    window.addEventListener('scroll', () => {
      if (!animating) { target = window.scrollY; current = window.scrollY; }
    }, { passive: true });

    NY.ticker.add(() => {
      if (!animating) return;
      current = lerp(current, target, 0.11);
      if (Math.abs(target - current) < 0.5) { current = target; animating = false; }
      window.scrollTo(0, current);
    });
  }

  /* ---------------------------------------------------------- split text */

  /** Wraps each word in a masked span so headlines can rise into view. */
  function splitText(el) {
    if (el.dataset.splitDone === 'true') return;
    const words = (el.textContent || '').trim().split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const mask = document.createElement('span');
      mask.className = 'split__mask';
      const inner = document.createElement('span');
      inner.className = 'split__word';
      inner.style.setProperty('--word-delay', `${i * 55}ms`);
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.dataset.splitDone = 'true';
  }

  /* ------------------------------------------------------------- reveals */

  let revealObserver = null;

  function initReveals(scope) {
    qsa('[data-split]', scope).forEach(splitText);

    const targets = qsa('[data-reveal]', scope).filter((el) => el.dataset.reveal !== 'in');
    if (!targets.length) return;

    if (reducedMotion()) {
      targets.forEach((el) => { el.dataset.reveal = 'in'; });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.reveal = 'in';
          revealObserver.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    }

    targets.forEach((el) => revealObserver.observe(el));
  }

  /* -------------------------------------------------- scroll-linked values */

  /* Elements opt in with `data-drift` or `data-parallax`; both receive a custom
     property between -1 and 1 describing where they sit in the viewport. */
  function initScrollLinked() {
    if (reducedMotion()) return;
    const nodes = qsa('[data-drift], [data-parallax]');
    if (!nodes.length) return;

    function update() {
      const vh = window.innerHeight;
      nodes.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) return;
        const centre = r.top + r.height / 2;
        const p = mapRange(centre, vh, 0, -1, 1);
        el.style.setProperty(el.hasAttribute('data-parallax') ? '--p' : '--drift', p.toFixed(4));
      });
    }

    NY.ticker.add(update);
    update();
  }

  /* ---------------------------------------------------------- accordions */

  function initAccordions(scope) {
    qsa('.accordion__trigger', scope).forEach((trigger) => {
      if (trigger.dataset.bound === 'true') return;
      trigger.dataset.bound = 'true';
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      trigger.addEventListener('click', () => {
        const open = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!open));
        if (panel) panel.dataset.open = String(!open);
      });
    });
  }

  /* -------------------------------------------------------------- anchors */

  function initAnchors() {
    qsa('a[href^="#"]').forEach((link) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      link.addEventListener('click', (e) => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });
    });
  }

  NY.motion = { initSmoothScroll, initReveals, initScrollLinked, initAccordions, initAnchors, splitText };
})(window.NY);
