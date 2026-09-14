/* =========================================================================
   Catalogue data — the single source of truth for products across every page.
   Copy is authored in Ukrainian (the primary language) with an English
   counterpart for the UA/EN switch in the frame.

   Each entry keeps its shared, language-independent fields at the top level
   (id, price, volume, artwork paths, accent colours) and everything that gets
   translated inside the `uk` and `en` blocks. `resolve()` merges the two.
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
      uk: {
        line: 'Лінія Dafne',
        name: 'Освітлювальна сироватка',
        claim: 'Концентрат, що дає шкірі енергію та сяйво.',
        text: 'Легка, але насичена сироватка, яка освітлює шкіру день за днем. Ослине молоко поєднується з дібраним вітамінним комплексом, щоб пом’якшити нерівний тон і повернути чистоту, ніколи не обтяжуючи шкіру.',
        familyLabel: 'Сироватки',
        actives: ['Ослине молоко', 'Ніацинамід', 'Стабілізований вітамін C'],
        ritual: 'Вранці та ввечері на чисту суху шкіру. Три краплі, вбиті подушечками пальців від центру обличчя назовні, перед кремом.',
        texture_note: 'Шовковистий флюїд, природне фінішне покриття, вбирається миттєво.',
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
      uk: {
        line: 'Лінія Dafne',
        name: 'Крем для обличчя Comfort',
        claim: 'Огортальне зволоження для найчутливішої шкіри.',
        text: 'Крем з ослиним молоком і вітаміном E — це більше, ніж зволожувач: це повноцінний щоденний догляд, який працює на кількох рівнях, щоб живити, захищати й заспокоювати шкірний бар’єр.',
        familyLabel: 'Креми',
        actives: ['Ослине молоко', 'Вітамін E', 'Масло ши'],
        ritual: 'Вранці та ввечері. Порція завбільшки з лісовий горіх, розподілена по обличчю й шиї круговими рухами, після сироватки.',
        texture_note: 'М’який крем, миттєвий комфорт, без жирної плівки.',
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
      uk: {
        line: 'Лінія Dafne',
        name: 'Крем для обличчя Hidra Lift',
        claim: 'Тонус, пружність і заново окреслений овал обличчя.',
        text: 'Колаген і гіалуронова кислота різної молекулярної маси діють у синергії з ослиним молоком, щоб наповнити шкіру й зменшити глибину зморшок. Текстура насичена, але не оклюзивна, вбирається швидко.',
        familyLabel: 'Креми',
        actives: ['Ослине молоко', 'Колаген', 'Гіалуронова кислота'],
        ritual: 'Ввечері або двічі на день для зрілої шкіри. Наносити знизу вгору, опрацьовуючи лінію щелепи та вилиці.',
        texture_note: 'Насичена текстура, оксамитове фінішне покриття, поступовий ефект наповнення.',
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
      uk: {
        line: 'Лінія Dafne',
        name: 'Набір-ритуал Dafne',
        claim: 'Три жести лінії в одному ритуалі.',
        text: 'Освітлювальна сироватка, крем Comfort і крем Hidra Lift, зібрані в набір, що розповідає весь ритуал Dafne. Найпростіший спосіб почати — або подарувати повну лінію.',
        familyLabel: 'Ритуали',
        actives: ['Ослине молоко', 'Вітамін E', 'Колаген', 'Гіалуронова кислота'],
        ritual: 'Сироватка, крем, захист: повний жест вранці та ввечері.',
        texture_note: 'Три взаємодоповнювальні формули, один ольфакторний підпис.',
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
    const locale = product[lang] || product.uk;
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
