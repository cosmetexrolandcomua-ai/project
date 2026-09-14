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
    // An element re-split after a language change was already unobserved, so it
    // has to be handed back to the observer.
    targets.forEach((el) => { if (revealObserver) revealObserver.unobserve(el); });
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

  /* --------------------------------------------------------- pinned stage */

  /**
   * Turns a section into a block that swaps its contents as the page scrolls.
   *
   * The section is made `steps + 1` screens tall and its inner stage is
   * `position: sticky`, so the stage holds still while the extra height is
   * consumed. Scroll distance across that pin maps to a step index, which is
   * what actually changes the visible block.
   *
   *   |<- 1 screen ->|<- 1 screen ->|<- 1 screen ->|<- 1 screen ->|
   *   |    step 0    |    step 1    |    step 2    |   release    |
   *
   * `screensPerStep` scales the per-step width of that diagram.
   *
   * Returns a handle so callers can re-count steps after a re-render and jump
   * to a given step.
   */
  function pinnedStage({ section, steps, screensPerStep = 1, onChange, onProgress }) {
    let count = Math.max(1, steps);
    let active = -1;

    /* `screensPerStep` tunes how much scrolling a block costs. A dense block
       (a product with copy to read) wants a full screen; three short lines of
       display type want less, or the page turns into a treadmill. */
    function layout() {
      section.style.height = `${(count * screensPerStep + 1) * 100}svh`;
    }

    /** Scroll distance available while the stage is pinned. */
    const span = () => section.offsetHeight - window.innerHeight;

    function progress() {
      const distance = span();
      if (distance <= 0) return 0;
      return clamp(-section.getBoundingClientRect().top / distance, 0, 0.99999);
    }

    function update() {
      const p = progress();
      if (onProgress) onProgress(p);
      const index = Math.floor(p * count);
      if (index === active) return;
      active = index;
      if (onChange) onChange(index);
    }

    function goTo(index) {
      const top = window.scrollY + section.getBoundingClientRect().top;
      // Land in the middle of the step's screen, away from either boundary.
      const step = span() / count;
      window.scrollTo({
        top: top + step * (clamp(index, 0, count - 1) + 0.5),
        behavior: reducedMotion() ? 'auto' : 'smooth',
      });
    }

    layout();
    NY.ticker.add(update);
    update();

    return {
      goTo,
      get index() { return active; },
      /** Called after a re-render changes how many blocks there are. */
      setSteps(next) {
        count = Math.max(1, next);
        active = -1;
        layout();
        update();
      },
    };
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

  NY.motion = { initSmoothScroll, initReveals, initScrollLinked, initAccordions, initAnchors, splitText, pinnedStage };
})(window.NY);
