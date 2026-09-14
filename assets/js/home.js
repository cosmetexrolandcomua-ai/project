/* =========================================================================
   Home page behaviour.

   All three of the home page's large blocks change on scroll rather than on a
   timer: the hero swaps slides, the showcase swaps products, and the statement
   band swaps lines. Each is a `NY.motion.pinnedStage` — the section is made
   several screens tall, its stage is sticky, and scroll distance across the
   pin selects which block is visible.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { qs, qsa, pad2, formatPrice, esc } = NY.util;

  /* ---------------------------------------------------------------- hero */

  function initHero() {
    const hero = qs('.hero');
    if (!hero) return;

    const slides = qsa('.hero__slide', hero);
    const dots = qsa('.hero__dot', hero);
    const exploreLink = qs('.hero__explore', hero);
    const thumbs = qsa('.explore__thumb img', hero);
    if (!slides.length) return;

    let active = -1;

    function show(index) {
      if (index === active) return;
      active = index;
      slides.forEach((slide, i) => { slide.dataset.active = String(i === index); });
      dots.forEach((dot, i) => { dot.setAttribute('aria-current', String(i === index)); });
      // The Explore card previews and links to whatever slide is showing.
      thumbs.forEach((img, i) => { img.dataset.active = String(i === index); });
      if (exploreLink && slides[index].dataset.href) {
        exploreLink.setAttribute('href', slides[index].dataset.href);
      }
    }

    const stage = NY.motion.pinnedStage({
      section: hero,
      steps: slides.length,
      screensPerStep: 0.8,
      onChange: show,
    });

    dots.forEach((dot, i) => dot.addEventListener('click', () => stage.goTo(i)));
    show(0);
  }

  /* -------------------------------------------------- product showcase */

  function initShowcase() {
    const section = qs('.showcase');
    if (!section) return;

    const panelHost = qs('.showcase__panels', section);
    const counter = qs('.showcase__counter', section);
    const thumbHost = qs('.showcase__thumbs', section);
    if (!panelHost || !thumbHost) return;

    let panels = [];
    let thumbs = [];
    let thumbLabel = null;
    let products = [];
    let active = -1;
    let stage = null;

    function render() {
      const lang = NY.i18n.lang;
      const t = NY.i18n.t;
      products = NY.data.showcase(lang);

      panelHost.innerHTML = products.map((p, i) => `
        <article class="showcase__panel" data-active="${i === 0}" data-index="${i}">
          <div class="showcase__copy">
            <p class="eyebrow showcase__eyebrow">${esc(p.line)}</p>
            <h3 class="showcase__name">${esc(p.name)}</h3>
            <p class="showcase__claim">${esc(p.claim)}</p>
            <p class="showcase__text">${esc(p.text)}</p>
            <p class="showcase__price">${formatPrice(p.price, lang)} <span class="muted">· ${esc(p.volume)}</span></p>
            <div class="showcase__actions">
              <a class="btn btn--light" href="product.html?id=${esc(p.id)}"><span>${esc(t('showcase.discover'))}</span></a>
              <button class="btn btn--light" type="button" data-add="${esc(p.id)}"><span>${esc(t('showcase.add'))}</span></button>
            </div>
          </div>
          <div class="showcase__oval">
            <img src="${esc(p.scene)}" alt="" loading="lazy" width="1200" height="1500">
          </div>
          <div class="showcase__bottle">
            <img src="${esc(p.bottle)}" alt="${esc(p.name)}" loading="lazy" width="340" height="760">
          </div>
        </article>
      `).join('');

      thumbHost.innerHTML = `
        <div class="showcase__thumbrow">
          ${products.map((p, i) => `
            <button class="showcase__thumb" type="button" data-index="${i}" aria-current="${i === 0}"
                    aria-label="${esc(p.name)}">
              <img src="${esc(p.bottle)}" alt="" loading="lazy" width="340" height="760">
            </button>`).join('')}
        </div>
        <p class="showcase__thumblabel" aria-hidden="true">${esc(products[0].name)}</p>`;

      panels = qsa('.showcase__panel', panelHost);
      thumbs = qsa('.showcase__thumb', thumbHost);
      thumbLabel = qs('.showcase__thumblabel', thumbHost);

      active = -1;
      if (stage) stage.setSteps(panels.length); else setActive(0);
    }

    function setActive(i) {
      if (i === active || !panels.length) return;
      active = i;
      panels.forEach((panel, n) => { panel.dataset.active = String(n === i); });
      thumbs.forEach((btn, n) => { btn.setAttribute('aria-current', String(n === i)); });
      if (counter) counter.textContent = `${pad2(i + 1)} / ${pad2(panels.length)}`;
      if (thumbLabel && products[i]) thumbLabel.textContent = products[i].name;
      if (products[i]) section.style.setProperty('--showcase-bg', products[i].stageBg);
    }

    // Bound once on the stable hosts, not inside render(), so re-rendering the
    // panels for a language switch cannot stack duplicate handlers.
    panelHost.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      if (!add) return;
      NY.cart.add(add.dataset.add, 1);
      NY.chrome.toast(NY.i18n.t('cart.added'));
    });

    thumbHost.addEventListener('click', (e) => {
      const btn = e.target.closest('.showcase__thumb');
      if (btn && stage) stage.goTo(Number(btn.dataset.index));
    });

    render();
    stage = NY.motion.pinnedStage({
      section,
      steps: panels.length,
      onChange: setActive,
    });
    document.addEventListener('lang:change', render);
  }

  /* ----------------------------------------------------- statement band */

  function initStatement() {
    const section = qs('.statement');
    if (!section) return;
    const lines = qsa('.statement__line', section);
    const counter = qs('.statement__counter', section);
    if (lines.length < 2) return;

    NY.motion.pinnedStage({
      section,
      steps: lines.length,
      screensPerStep: 0.6,
      onChange(index) {
        lines.forEach((line, i) => { line.dataset.active = String(i === index); });
        if (counter) counter.textContent = `${pad2(index + 1)} / ${pad2(lines.length)}`;
      },
    });
  }

  NY.home = { initHero, initShowcase, initStatement };
})(window.NY);
