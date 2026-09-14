/* =========================================================================
   Catalogue data — the single source of truth for products across every page.
   Copy is authored in Italian first (the brand's primary market) with an
   English counterpart for the IT/EN switch in the frame.
   ========================================================================= */
(function (NY) {
  'use strict';

  const PRODUCTS = [
    {
      id: 'siero-viso-illuminante',
      order: 1,
      family: 'siero',
      price: 32.9,
      volume: '30ml',
      ounces: '1.01 fl.oz',
      bottle: 'assets/img/products/bottle-siero.svg',
      scene: 'assets/img/scenes/still-travertine.svg',
      ritualShot: 'assets/img/scenes/ritual-siero.svg',
      texture: 'assets/img/scenes/texture-milk.svg',
      accent: '#B9C7D1',
      stageBg: '#93A2AE',
      it: {
        line: 'Linea Dafne',
        name: 'Siero Viso Illuminante',
        claim: 'Il concentrato che dà energia e splendore all’incarnato.',
        text: 'Un siero leggero ma ricco, capace di illuminare la pelle giorno dopo giorno. Il latte d’asina si unisce a un complesso vitaminico selezionato per attenuare le discromie e restituire uniformità, senza mai appesantire.',
        familyLabel: 'Sieri',
        actives: ['Latte d’asina', 'Niacinamide', 'Vitamina C stabilizzata'],
        ritual: 'Mattina e sera, su pelle pulita e asciutta. Tre gocce, picchiettate dal centro del viso verso l’esterno, prima della crema.',
        texture_note: 'Fluido setoso, finish naturale, assorbimento immediato.',
      },
      en: {
        line: 'Dafne Line',
        name: 'Illuminating Face Serum',
        claim: 'The concentrate that gives the complexion energy and glow.',
        text: 'A light yet generous serum that brightens the skin day after day. Donkey milk meets a selected vitamin complex to soften uneven tone and restore clarity, without ever weighing the skin down.',
        familyLabel: 'Serums',
        actives: ['Donkey milk', 'Niacinamide', 'Stabilised vitamin C'],
        ritual: 'Morning and evening on clean, dry skin. Three drops, pressed from the centre of the face outwards, before your cream.',
        texture_note: 'Silky fluid, natural finish, absorbs on contact.',
      },
    },
    {
      id: 'crema-viso-comfort',
      order: 2,
      family: 'crema',
      price: 34.9,
      volume: '50ml',
      ounces: '1.69 fl.oz',
      bottle: 'assets/img/products/bottle-comfort.svg',
      scene: 'assets/img/scenes/still-travertine.svg',
      ritualShot: 'assets/img/scenes/ritual-comfort.svg',
      texture: 'assets/img/scenes/texture-cream.svg',
      accent: '#CFE0EC',
      stageBg: '#A89376',
      it: {
        line: 'Linea Dafne',
        name: 'Crema Viso Comfort',
        claim: 'Idratazione avvolgente per le pelli più sensibili.',
        text: 'La Crema Viso Latte d’Asina + Vitamina E è più di una semplice idratante: è un trattamento quotidiano completo, che lavora su più livelli per nutrire, proteggere e lenire la barriera cutanea.',
        familyLabel: 'Creme',
        actives: ['Latte d’asina', 'Vitamina E', 'Burro di karité'],
        ritual: 'Mattina e sera. Una noce di prodotto distribuita su viso e collo con movimenti circolari, dopo il siero.',
        texture_note: 'Crema morbida, comfort immediato, nessun film oleoso.',
      },
      en: {
        line: 'Dafne Line',
        name: 'Comfort Face Cream',
        claim: 'Enveloping hydration for the most sensitive skin.',
        text: 'The Donkey Milk + Vitamin E Face Cream is more than a moisturiser: it is a complete daily treatment that works on several levels to nourish, protect and soothe the skin barrier.',
        familyLabel: 'Creams',
        actives: ['Donkey milk', 'Vitamin E', 'Shea butter'],
        ritual: 'Morning and evening. A hazelnut-sized amount over face and neck in circular movements, after your serum.',
        texture_note: 'Soft cream, immediate comfort, no oily film.',
      },
    },
    {
      id: 'crema-viso-hidra-lift',
      order: 3,
      family: 'crema',
      price: 37.9,
      volume: '50ml',
      ounces: '1.69 fl.oz',
      bottle: 'assets/img/products/bottle-hidra-lift.svg',
      scene: 'assets/img/scenes/still-emerald.svg',
      ritualShot: 'assets/img/scenes/ritual-hidra.svg',
      texture: 'assets/img/scenes/texture-leaf.svg',
      accent: '#D2D8DE',
      stageBg: '#1D4433',
      it: {
        line: 'Linea Dafne',
        name: 'Crema Viso Hidra Lift',
        claim: 'Tono, elasticità e un contorno del viso ridisegnato.',
        text: 'Collagene e acido ialuronico a diverso peso molecolare agiscono in sinergia con il latte d’asina per rimpolpare la pelle e attenuare la profondità delle rughe. La texture, ricca ma non occlusiva, si assorbe rapidamente.',
        familyLabel: 'Creme',
        actives: ['Latte d’asina', 'Collagene', 'Acido ialuronico'],
        ritual: 'Sera, o mattina e sera sulle pelli mature. Applicare dal basso verso l’alto, insistendo su mandibola e zigomi.',
        texture_note: 'Texture ricca, finish vellutato, effetto rimpolpante progressivo.',
      },
      en: {
        line: 'Dafne Line',
        name: 'Hidra Lift Face Cream',
        claim: 'Firmness, elasticity and a redrawn facial contour.',
        text: 'Collagen and multi-weight hyaluronic acid work in synergy with donkey milk to plump the skin and soften the depth of lines. The texture is rich but never occlusive and absorbs quickly.',
        familyLabel: 'Creams',
        actives: ['Donkey milk', 'Collagen', 'Hyaluronic acid'],
        ritual: 'Evening, or morning and evening on mature skin. Apply upwards, working along the jaw and cheekbones.',
        texture_note: 'Rich texture, velvet finish, progressive plumping effect.',
      },
    },
    {
      id: 'cofanetto-dafne',
      order: 4,
      family: 'rituale',
      price: 95.0,
      volume: '30ml + 50ml + 50ml',
      ounces: 'Set completo',
      bottle: 'assets/img/products/bottle-comfort.svg',
      scene: 'assets/img/scenes/still-linea.svg',
      ritualShot: 'assets/img/scenes/ritual-comfort.svg',
      texture: 'assets/img/scenes/texture-stone.svg',
      accent: '#E2D8C6',
      stageBg: '#B5A388',
      it: {
        line: 'Linea Dafne',
        name: 'Cofanetto Rituale Dafne',
        claim: 'I tre gesti della linea, in un unico rituale.',
        text: 'Siero Illuminante, Crema Comfort e Crema Hidra Lift riuniti nel cofanetto che racconta l’intero rituale Dafne. Il modo più semplice per iniziare, o per regalare la linea completa.',
        familyLabel: 'Rituali',
        actives: ['Latte d’asina', 'Vitamina E', 'Collagene', 'Acido ialuronico'],
        ritual: 'Siero, crema, protezione: il gesto completo mattina e sera.',
        texture_note: 'Tre formule complementari, un’unica firma olfattiva.',
      },
      en: {
        line: 'Dafne Line',
        name: 'Dafne Ritual Set',
        claim: 'The three gestures of the line, in a single ritual.',
        text: 'Illuminating Serum, Comfort Cream and Hidra Lift Cream brought together in the set that tells the whole Dafne ritual. The simplest way to begin — or to gift the complete line.',
        familyLabel: 'Rituals',
        actives: ['Donkey milk', 'Vitamin E', 'Collagen', 'Hyaluronic acid'],
        ritual: 'Serum, cream, protection: the complete gesture morning and evening.',
        texture_note: 'Three complementary formulas, one olfactory signature.',
      },
    },
  ];

  /** Returns the product, merged with the fields for the active language. */
  function resolve(product, lang) {
    const locale = product[lang] || product.it;
    return Object.assign({}, product, locale);
  }

  NY.data = {
    products: PRODUCTS,
    byId: (id) => PRODUCTS.find((p) => p.id === id) || null,
    /** Products in showcase order, localised. */
    list: (lang) => PRODUCTS.slice().sort((a, b) => a.order - b.order).map((p) => resolve(p, lang)),
    resolve,
    /** The three hero products; the gift set is catalogue-only. */
    showcase: (lang) => PRODUCTS.filter((p) => p.family !== 'rituale').sort((a, b) => a.order - b.order).map((p) => resolve(p, lang)),
  };
})(window.NY);
