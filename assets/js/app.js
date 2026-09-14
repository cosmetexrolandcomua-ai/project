/* =========================================================================
   Boot sequence. Loaded last; wires every module to the current document.
   ========================================================================= */
(function (NY) {
  'use strict';

  function markCurrentNav() {
    const here = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    NY.util.qsa('.frame__link[href]').forEach((link) => {
      const target = link.getAttribute('href').split('/').pop().toLowerCase();
      if (target === here) link.setAttribute('aria-current', 'page');
    });
  }

  function boot() {
    NY.i18n.init();
    markCurrentNav();

    NY.chrome.initCursor();
    NY.chrome.initChromeTheme();
    NY.chrome.initCartBadge();

    NY.catalog.initLineup();
    NY.catalog.initCatalogue();
    NY.catalog.initProduct();
    NY.catalog.initCartPage();
    NY.catalog.initContactForm();

    NY.home.initHero();
    NY.home.initShowcase();

    NY.motion.initSmoothScroll();
    NY.motion.initAccordions(document);
    NY.motion.initAnchors();
    NY.motion.initScrollLinked();

    // The reveal pass waits for the intro so nothing animates behind the curtain.
    document.addEventListener('preloader:done', () => {
      NY.motion.initReveals(document);
      NY.chrome.initRail();
    }, { once: true });

    NY.preloader.init();

    // Re-run the reveal pass after a language switch re-renders any copy.
    document.addEventListener('lang:change', () => NY.motion.initReveals(document));

    document.documentElement.dataset.ready = 'true';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})(window.NY);
