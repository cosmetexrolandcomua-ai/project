/* =========================================================================
   Home page behaviour: the split hero slider and the pinned product showcase.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { qs, qsa, clamp, pad2, formatPrice, reducedMotion, esc } = NY.util;

  /* ---------------------------------------------------------------- hero */

  function initHero() {
    const hero = qs('.hero');
    if (!hero) return;

    const slides = qsa('.hero__slide', hero);
    const dots = qsa('.hero__dot', hero);
    const exploreLink = qs('.hero__explore', hero);
    const thumbs = qsa('.explore__thumb img', hero);
    if (!slides.length) return;

    let index = 0;
    let thumbIndex = 0;
    let slideTimer;
    let thumbTimer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => { slide.dataset.active = String(i === index); });
      dots.forEach((dot, i) => { dot.setAttribute('aria-current', String(i === index)); });
      if (exploreLink) {
        const href = slides[index].dataset.href;
        if (href) exploreLink.setAttribute('href', href);
      }
    }

    function cycleThumb() {
      if (thumbs.length < 2) return;
      thumbIndex = (thumbIndex + 1) % thumbs.length;
      thumbs.forEach((img, i) => { img.dataset.active = String(i === thumbIndex); });
    }

    function schedule() {
      clearInterval(slideTimer);
      clearInterval(thumbTimer);
      if (reducedMotion() || slides.length < 2) return;
      slideTimer = setInterval(() => show(index + 1), 7000);
      thumbTimer = setInterval(cycleThumb, 2400);
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { show(i); schedule(); });
    });

    // Autoplay is a courtesy, not a demand: it stops whenever the tab is hidden.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { clearInterval(slideTimer); clearInterval(thumbTimer); }
      else schedule();
    });

    show(0);
    thumbs.forEach((img, i) => { img.dataset.active = String(i === 0); });
    schedule();
  }

  /* ----------------------------------------------------- pinned showcase */

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
              <a class="btn btn--light" href="prodotto.html?id=${esc(p.id)}"><span>${esc(t('showcase.discover'))}</span></a>
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

      // One screen of scroll per product, plus one to exit the pin.
      section.style.setProperty('--panels', String(products.length));
      section.style.height = `${(products.length + 1) * 100}svh`;

      active = -1;
      setActive(0);
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
      if (btn) scrollToPanel(Number(btn.dataset.index));
    });

    function scrollToPanel(i) {
      const rect = section.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      const span = section.offsetHeight - window.innerHeight;
      const step = span / panels.length;
      window.scrollTo({ top: top + step * (i + 0.5), behavior: reducedMotion() ? 'auto' : 'smooth' });
    }

    function setActive(i) {
      if (i === active) return;
      active = i;
      panels.forEach((panel, n) => { panel.dataset.active = String(n === i); });
      thumbs.forEach((btn, n) => { btn.setAttribute('aria-current', String(n === i)); });
      if (thumbLabel && products[i]) thumbLabel.textContent = products[i].name;
      if (counter) counter.textContent = `${pad2(i + 1)} / ${pad2(panels.length)}`;
      if (products[i]) section.style.setProperty('--showcase-bg', products[i].stageBg);
    }

    function update() {
      if (!panels.length) return;
      const rect = section.getBoundingClientRect();
      const span = section.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const progress = clamp(-rect.top / span, 0, 0.9999);
      setActive(Math.floor(progress * panels.length));
    }

    render();
    document.addEventListener('lang:change', render);
    NY.ticker.add(update);
    update();
  }

  NY.home = { initHero, initShowcase };
})(window.NY);
