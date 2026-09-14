/* =========================================================================
   Cart store — a demonstration basket held in localStorage.
   No payment provider is wired up; checkout only reports its own state.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { storage, emit } = NY.util;
  const KEY = 'nymphai:cart';
  const FREE_SHIPPING_FROM = 49;
  const SHIPPING_FLAT = 4.9;

  /** Shape: { "<product-id>": <quantity> } — ids are validated on read so a
      stale entry from a removed product can never break a render. */
  let items = sanitise(storage.get(KEY, {}));

  function sanitise(raw) {
    const out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach((id) => {
      const qty = Math.floor(Number(raw[id]));
      if (NY.data.byId(id) && Number.isFinite(qty) && qty > 0) out[id] = Math.min(qty, 99);
    });
    return out;
  }

  function persist() {
    storage.set(KEY, items);
    emit('cart:change', { items: Object.assign({}, items), count: count() });
  }

  const count = () => Object.values(items).reduce((sum, q) => sum + q, 0);

  function lines(lang) {
    return Object.keys(items).map((id) => {
      const product = NY.data.resolve(NY.data.byId(id), lang);
      return { product, qty: items[id], line: product.price * items[id] };
    }).sort((a, b) => a.product.order - b.product.order);
  }

  function totals(lang) {
    const subtotal = lines(lang).reduce((sum, l) => sum + l.line, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT;
    return { subtotal, shipping, total: subtotal + shipping, freeFrom: FREE_SHIPPING_FROM };
  }

  function add(id, qty) {
    if (!NY.data.byId(id)) return false;
    const next = (items[id] || 0) + (qty || 1);
    items[id] = Math.min(Math.max(next, 1), 99);
    persist();
    return true;
  }

  function setQty(id, qty) {
    if (!NY.data.byId(id)) return;
    const n = Math.floor(Number(qty));
    if (!Number.isFinite(n) || n <= 0) { remove(id); return; }
    items[id] = Math.min(n, 99);
    persist();
  }

  function remove(id) {
    if (!(id in items)) return;
    delete items[id];
    persist();
  }

  function clear() { items = {}; persist(); }

  NY.cart = { add, setQty, remove, clear, count, lines, totals, get items() { return Object.assign({}, items); } };
})(window.NY);
