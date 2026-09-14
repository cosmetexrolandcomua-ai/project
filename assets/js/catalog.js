/* =========================================================================
   Catalogue rendering: product grids, the product detail page and the cart.
   Every renderer re-runs on `lang:change`, so the IT/EN switch needs no reload.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { qs, qsa, formatPrice, esc } = NY.util;

  /* ------------------------------------------------------------ shared card */

  function card(p, lang) {
    return `
      <a class="product-card" href="product.html?id=${esc(p.id)}" style="--card-accent:${esc(p.accent)}"
         data-reveal data-cursor-label="${esc(NY.i18n.t('showcase.discover'))}">
        <div class="product-card__figure">
          <img src="${esc(p.bottle)}" alt="${esc(p.name)}" loading="lazy" width="340" height="760">
        </div>
        <div class="product-card__body">
          <p class="eyebrow muted">${esc(p.line)}</p>
          <h3 class="product-card__name">${esc(p.name)}</h3>
          <p class="product-card__meta">${esc(p.claim)}</p>
          <div class="product-card__foot">
            <span class="product-card__price">${formatPrice(p.price, lang)}</span>
            <span class="product-card__meta">${esc(p.volume)}</span>
          </div>
        </div>
      </a>`;
  }

  /* ---------------------------------------------------------- home lineup */

  function initLineup() {
    const grid = qs('[data-lineup]');
    if (!grid) return;
    function render() {
      const lang = NY.i18n.lang;
      grid.innerHTML = NY.data.list(lang).map((p) => card(p, lang)).join('');
      NY.motion.initReveals(grid);
    }
    render();
    document.addEventListener('lang:change', render);
  }

  /* ------------------------------------------------------------ catalogue */

  function initCatalogue() {
    const grid = qs('[data-catalogue]');
    if (!grid) return;
    const filterHost = qs('[data-filters]');
    let filter = 'all';

    /* Keyed by the stable family id so a language switch never invalidates the
       current selection; the label is what the button shows. */
    function families(lang) {
      const seen = new Map();
      NY.data.list(lang).forEach((p) => { if (!seen.has(p.family)) seen.set(p.family, p.familyLabel); });
      return Array.from(seen, ([key, label]) => ({ key, label }));
    }

    function render() {
      const lang = NY.i18n.lang;
      const all = NY.data.list(lang);

      if (filterHost) {
        const options = [{ key: 'all', label: NY.i18n.t('catalogue.all') }].concat(families(lang));
        if (!options.some((o) => o.key === filter)) filter = 'all';
        filterHost.innerHTML = options.map((o) => `
          <button class="filter" type="button" data-filter="${esc(o.key)}"
                  aria-pressed="${o.key === filter}">${esc(o.label)}</button>`).join('');
      }

      const visible = filter === 'all' ? all : all.filter((p) => p.family === filter);
      grid.innerHTML = visible.length
        ? visible.map((p) => card(p, lang)).join('')
        : `<p class="catalogue__empty">${esc(NY.i18n.t('catalogue.empty'))}</p>`;
      NY.motion.initReveals(grid);
    }

    if (filterHost) {
      filterHost.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn) return;
        filter = btn.dataset.filter;
        render();
      });
    }

    render();
    document.addEventListener('lang:change', render);
  }

  /* --------------------------------------------------------- product page */

  function initProduct() {
    const root = qs('[data-pdp]');
    if (!root) return;

    const id = new URLSearchParams(window.location.search).get('id');
    const base = NY.data.byId(id) || NY.data.products[0];
    let qty = 1;

    function render() {
      const lang = NY.i18n.lang;
      const p = NY.data.resolve(base, lang);
      const t = NY.i18n.t;
      document.title = `${p.name} — Nymphai Cosmetics`;

      const shots = [
        { src: p.bottle, type: 'bottle' },
        { src: p.scene, type: 'shot' },
        { src: p.ritualShot, type: 'shot' },
        { src: p.texture, type: 'shot' },
      ];

      root.innerHTML = `
        <div class="pdp__gallery">
          <div class="pdp__stage" style="--pdp-bg:${esc(p.accent)}">
            ${shots.map((s, i) => (s.type === 'bottle'
              ? `<img class="pdp__bottle" src="${esc(s.src)}" alt="${esc(p.name)}" data-active="${i === 0}" width="340" height="760">`
              : `<img class="pdp__shot" src="${esc(s.src)}" alt="" data-active="${i === 0}" loading="lazy" width="1200" height="1500">`)).join('')}
          </div>
          <div class="pdp__thumbs">
            ${shots.map((s, i) => `
              <button class="pdp__thumb" type="button" data-shot="${i}" aria-current="${i === 0}"
                      aria-label="${esc(p.name)} ${i + 1}">
                <img src="${esc(s.src)}" alt="" loading="lazy" width="340" height="760">
              </button>`).join('')}
          </div>
        </div>

        <div class="pdp__info">
          <a class="textlink muted" href="products.html">← ${esc(t('pdp.back'))}</a>
          <p class="eyebrow muted">${esc(p.line)}</p>
          <h1 class="pdp__name">${esc(p.name)}</h1>
          <p class="pdp__claim">${esc(p.claim)}</p>
          <div class="pdp__pricerow">
            <span class="pdp__price">${formatPrice(p.price, lang)}</span>
            <span class="pdp__size">${esc(p.volume)} · ${esc(p.ounces)}</span>
          </div>
          <p class="body-copy">${esc(p.text)}</p>

          <div>
            <p class="eyebrow muted" style="margin-bottom:.7rem">${esc(t('pdp.actives'))}</p>
            <div class="pdp__actives">${p.actives.map((a) => `<span class="tag">${esc(a)}</span>`).join('')}</div>
          </div>

          <div class="pdp__buy">
            <div class="qty">
              <button type="button" data-qty="-1" aria-label="${esc(t('pdp.decrease'))}">−</button>
              <output data-qty-value aria-live="polite">${qty}</output>
              <button type="button" data-qty="1" aria-label="${esc(t('pdp.increase'))}">+</button>
            </div>
            <button class="btn btn--solid" type="button" data-add><span>${esc(t('pdp.add'))}</span></button>
          </div>

          <div class="accordion" style="margin-top:1.5rem">
            ${[
              { q: t('pdp.ritual'), a: p.ritual },
              { q: t('pdp.texture'), a: p.texture_note },
              { q: t('pdp.faq1.q'), a: t('pdp.faq1.a') },
              { q: t('pdp.faq2.q'), a: t('pdp.faq2.a') },
              { q: t('pdp.faq3.q'), a: t('pdp.faq3.a') },
            ].map((item, i) => `
              <div class="accordion__item">
                <button class="accordion__trigger" type="button" aria-expanded="${i === 0}"
                        aria-controls="acc-${i}">
                  <span>${esc(item.q)}</span><span class="accordion__icon" aria-hidden="true"></span>
                </button>
                <div class="accordion__panel" id="acc-${i}" data-open="${i === 0}">
                  <div><p>${esc(item.a)}</p></div>
                </div>
              </div>`).join('')}
          </div>
        </div>`;

      NY.motion.initAccordions(root);
    }

    root.addEventListener('click', (e) => {
      const step = e.target.closest('[data-qty]');
      if (step) {
        qty = Math.min(Math.max(qty + Number(step.dataset.qty), 1), 99);
        const out = qs('[data-qty-value]', root);
        if (out) out.textContent = String(qty);
        return;
      }
      if (e.target.closest('[data-add]')) {
        NY.cart.add(base.id, qty);
        NY.chrome.toast(NY.i18n.t('cart.added'));
        return;
      }
      const thumb = e.target.closest('[data-shot]');
      if (thumb) {
        const i = Number(thumb.dataset.shot);
        qsa('.pdp__thumb', root).forEach((b, n) => b.setAttribute('aria-current', String(n === i)));
        qsa('.pdp__stage img', root).forEach((img, n) => { img.dataset.active = String(n === i); });
      }
    });

    render();
    document.addEventListener('lang:change', render);
  }

  /* ------------------------------------------------------------ cart page */

  function initCartPage() {
    const root = qs('[data-cart-page]');
    if (!root) return;

    function render() {
      const lang = NY.i18n.lang;
      const t = NY.i18n.t;
      const lines = NY.cart.lines(lang);
      const sums = NY.cart.totals(lang);

      if (!lines.length) {
        root.innerHTML = `
          <div class="cart__empty" style="grid-column:1/-1">
            <p class="subtitle">${esc(t('cart.empty'))}</p>
            <a class="btn btn--solid" href="products.html"><span>${esc(t('cart.continue'))}</span></a>
          </div>`;
        return;
      }

      root.innerHTML = `
        <div class="cart__list">
          ${lines.map(({ product, qty, line }) => `
            <div class="cart__row" data-row="${esc(product.id)}">
              <div class="cart__figure">
                <img src="${esc(product.bottle)}" alt="${esc(product.name)}" loading="lazy" width="340" height="760">
              </div>
              <div class="cart__meta">
                <a class="cart__name" href="product.html?id=${esc(product.id)}">${esc(product.name)}</a>
                <span class="cart__sub">${esc(product.volume)} · ${formatPrice(product.price, lang)}</span>
              </div>
              <div class="cart__controls">
                <div class="qty">
                  <button type="button" data-step="-1" aria-label="${esc(t('pdp.decrease'))}">−</button>
                  <output aria-live="polite">${qty}</output>
                  <button type="button" data-step="1" aria-label="${esc(t('pdp.increase'))}">+</button>
                </div>
                <span class="cart__sub">${formatPrice(line, lang)}</span>
                <button class="cart__remove" type="button" data-remove>${esc(t('cart.remove'))}</button>
              </div>
            </div>`).join('')}
        </div>

        <aside class="cart__summary">
          <div class="cart__line"><span>${esc(t('cart.subtotal'))}</span><span>${formatPrice(sums.subtotal, lang)}</span></div>
          <div class="cart__line">
            <span>${esc(t('cart.shipping'))}</span>
            <span>${sums.shipping === 0 ? esc(t('cart.shipping.free')) : formatPrice(sums.shipping, lang)}</span>
          </div>
          <div class="cart__line cart__line--total"><span>${esc(t('cart.total'))}</span><span>${formatPrice(sums.total, lang)}</span></div>
          <button class="btn btn--solid" type="button" data-checkout style="justify-content:center">
            <span>${esc(t('cart.checkout'))}</span>
          </button>
          <p class="cart__note">${esc(t('cart.note'))}</p>
        </aside>`;
    }

    root.addEventListener('click', (e) => {
      const row = e.target.closest('[data-row]');
      if (row) {
        const id = row.dataset.row;
        const step = e.target.closest('[data-step]');
        if (step) { NY.cart.setQty(id, (NY.cart.items[id] || 0) + Number(step.dataset.step)); return; }
        if (e.target.closest('[data-remove]')) { NY.cart.remove(id); return; }
      }
      if (e.target.closest('[data-checkout]')) NY.chrome.toast(NY.i18n.t('cart.demo'));
    });

    render();
    document.addEventListener('cart:change', render);
    document.addEventListener('lang:change', render);
  }

  /* --------------------------------------------------------- contact form */

  function initContactForm() {
    const form = qs('[data-contact-form]');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      NY.chrome.toast(NY.i18n.t('contact.sent'));
      form.reset();
    });
  }

  NY.catalog = { initLineup, initCatalogue, initProduct, initCartPage, initContactForm, card };
})(window.NY);
