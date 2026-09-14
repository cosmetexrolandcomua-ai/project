/* =========================================================================
   Core namespace: DOM helpers, maths, and a single shared rAF ticker.
   Loaded first; every other module hangs off window.NY.
   ========================================================================= */
window.NY = window.NY || {};

(function (NY) {
  'use strict';

  const qs = (sel, scope) => (scope || document).querySelector(sel);
  const qsa = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const lerp = (a, b, t) => a + (b - a) * t;
  /** Remaps `v` from [inMin,inMax] to [outMin,outMax], clamped at both ends. */
  const mapRange = (v, inMin, inMax, outMin, outMax) =>
    clamp(((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin, Math.min(outMin, outMax), Math.max(outMin, outMax));

  const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isCoarse = () =>
    window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------------------------------------------------------- ticker */
  /* One requestAnimationFrame loop for the whole site; modules subscribe to it
     so we never end up with a dozen competing loops. */
  const subscribers = new Set();
  let running = false;

  function frame(time) {
    subscribers.forEach((fn) => fn(time));
    if (subscribers.size) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  const ticker = {
    add(fn) {
      subscribers.add(fn);
      if (!running) {
        running = true;
        requestAnimationFrame(frame);
      }
      return () => subscribers.delete(fn);
    },
    remove(fn) { subscribers.delete(fn); },
  };

  /* ------------------------------------------------------------- viewport */

  const viewport = { w: window.innerWidth, h: window.innerHeight };
  const resizeHandlers = new Set();
  let resizeTimer;

  window.addEventListener('resize', () => {
    viewport.w = window.innerWidth;
    viewport.h = window.innerHeight;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => resizeHandlers.forEach((fn) => fn(viewport)), 120);
  }, { passive: true });

  const onResize = (fn) => { resizeHandlers.add(fn); return () => resizeHandlers.delete(fn); };

  /* -------------------------------------------------------------- storage */
  /* Private browsing and blocked cookies both make localStorage throw, so every
     access is guarded and simply degrades to "nothing was stored". */
  const storage = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (err) { return fallback; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (err) { return false; }
    },
  };

  /* ----------------------------------------------------------------- misc */

  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));

  /** 32,90 € in Italian, € 32.90 in English — matched to the active locale. */
  const formatPrice = (value, lang) =>
    new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'it-IT', {
      style: 'currency', currency: 'EUR', minimumFractionDigits: 2,
    }).format(value);

  const pad2 = (n) => String(n).padStart(2, '0');

  /** Escapes text destined for an innerHTML template. */
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  NY.util = { qs, qsa, clamp, lerp, mapRange, reducedMotion, isCoarse, onResize, storage, emit, formatPrice, pad2, esc };
  NY.ticker = ticker;
  NY.viewport = viewport;
})(window.NY);
