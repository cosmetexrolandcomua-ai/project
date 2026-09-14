/* =========================================================================
   Ukrainian / English switching for the whole site.
   Ukrainian is the primary language; English is the secondary.

   Markup opts in with:
     <span data-i18n="nav.products">Продукти</span>
     <input data-i18n-attr="placeholder:contact.email">
   Modules that render from data listen for the `lang:change` event.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { storage, emit } = NY.util;
  const KEY = 'nymphai:lang';
  const LANGS = ['uk', 'en'];
  const DEFAULT = 'uk';

  const DICT = {
    uk: {
      'skip': 'Перейти до вмісту',
      'nav.home': 'Головна',
      'nav.products': 'Продукти',
      'nav.brand': 'Бренд',
      'nav.cart': 'Кошик',
      'nav.lang': 'Мова',
      'nav.primary': 'Основна навігація',

      'hero.explore': 'Дивитись',
      'hero.slide': 'Перейти до слайда',
      'hero.1.title': 'Крем для обличчя',
      'hero.1.caption': 'Comfort',
      'hero.2.title': 'Крем для обличчя',
      'hero.2.caption': 'Hidra Lift',
      'hero.3.title': 'Сироватка',
      'hero.3.caption': 'Illuminante',

      'loader.cta': 'Відкрити лінію',
      'loader.left': 'Nymphai',
      'loader.right': 'Cosmetics',
      'loader.label': 'Завантаження',

      'manifesto.title': 'Щоденний жест, що стає ритуалом',
      'manifesto.p1': 'Лінія Dafne — це перший розділ ритуалу щоденного перетворення. Клінічно протестована косметика з формулами, розробленими, щоб живити, відновлювати й захищати шкіру з часом.',
      'manifesto.p2': 'Ослине молоко, серце формули, поєднується з науково дібраними активами — колагеном, гіалуроновою кислотою та вітаміном E, — щоб бути делікатним навіть до найчутливішої шкіри й день за днем вести її до нового розквіту.',

      'showcase.discover': 'Дивитись продукт',
      'showcase.add': 'До кошика',
      'showcase.region': 'Лінія Dafne',

      'statement.1a': 'Косметика',
      'statement.1b': 'клінічно',
      'statement.1c': 'протестована',
      'statement.2': 'Формули, що працюють',
      'statement.3a': 'Ослине',
      'statement.3b': 'молоко',

      'lineup.eyebrow': 'Лінія Dafne',
      'lineup.title': 'Повна лінія',
      'lineup.link': 'Усі продукти',

      'catalogue.eyebrow': 'Каталог',
      'catalogue.title': 'Продукти',
      'catalogue.lede': 'Чотири жести, одна лінія. Клінічно протестовані формули, побудовані навколо ослиного молока й активів, дібраних по одному.',
      'catalogue.all': 'Усі',
      'catalogue.empty': 'У цій категорії поки що немає продуктів.',
      'catalogue.filters': 'Фільтри',

      'pdp.add': 'Додати до кошика',
      'pdp.back': 'Назад до продуктів',
      'pdp.actives': 'Головні активи',
      'pdp.ritual': 'Ритуал',
      'pdp.texture': 'Текстура',
      'pdp.quantity': 'Кількість',
      'pdp.increase': 'Збільшити кількість',
      'pdp.decrease': 'Зменшити кількість',
      'pdp.faq1.q': 'Чи підходить для чутливої шкіри?',
      'pdp.faq1.a': 'Так. Усі формули Dafne дерматологічно протестовані на чутливій шкірі та створені без агресивних віддушок.',
      'pdp.faq2.q': 'Коли буде видно результат?',
      'pdp.faq2.a': 'Відчуття комфорту з’являється одразу. Для тону й рівності радимо повний курс на вісім тижнів.',
      'pdp.faq3.q': 'Як зберігати продукт?',
      'pdp.faq3.a': 'За кімнатної температури, подалі від тепла й прямого світла. Використати протягом дванадцяти місяців після відкриття.',

      'cart.title': 'Кошик',
      'cart.empty': 'Ваш кошик порожній.',
      'cart.continue': 'Відкрити лінію',
      'cart.subtotal': 'Проміжна сума',
      'cart.shipping': 'Доставка',
      'cart.shipping.free': 'Безкоштовно',
      'cart.total': 'Разом',
      'cart.checkout': 'Оформити замовлення',
      'cart.remove': 'Видалити',
      'cart.note': 'Безкоштовна доставка для замовлень від 49 €. Повернення протягом 14 днів.',
      'cart.added': 'Додано до кошика',
      'cart.demo': 'Це демонстраційна вітрина: оформлення замовлення не під’єднане до платіжної системи.',

      'brand.eyebrow': 'Бренд',
      'brand.title': 'Nymphai Cosmetics',
      'brand.lede': 'Косметика, що поєднує делікатність ослиного молока зі суворістю фармацевтичних досліджень.',
      'brand.story.title': 'Від інгредієнта до ритуалу',
      'brand.story.p1': 'Nymphai почався з простої ідеї: взяти найдавніший інгредієнт — ослине молоко — і провести його через метод сучасної косметології. Без роздутих обіцянок і без зрізаних кутів у рецептурі.',
      'brand.story.p2': 'Кожен продукт лінії Dafne народжується в лабораторії, проходить клінічні тести й потрапляє на шкіру лише тоді, коли результат можна виміряти. Решту — жест, світло, час для себе — додаєте ви.',
      'brand.pillars.title': 'Три принципи',
      'brand.pillar1.title': 'Клінічно протестовано',
      'brand.pillar1.text': 'Кожна формула проходить протокол дерматологічних тестів на чутливій шкірі, перш ніж потрапити у виробництво.',
      'brand.pillar2.title': 'Формули, що працюють',
      'brand.pillar2.text': 'Задекларовані відсотки активів, без наповнювачів. Колаген, гіалуронова кислота та вітамін E в корисних концентраціях.',
      'brand.pillar3.title': 'Ослине молоко',
      'brand.pillar3.text': 'Багате на фосфоліпіди, вітаміни A та E й незамінні жирні кислоти: живить, не забиваючи пори, навіть реактивну шкіру.',
      'brand.cta': 'Відкрити лінію Dafne',

      'contact.eyebrow': 'Контакти',
      'contact.title': 'Поговорімо',
      'contact.lede': 'Питання про лінію, склад або замовлення: напишіть нам — відповідаємо протягом двох робочих днів.',
      'contact.name': 'Ім’я та прізвище',
      'contact.email': 'Email',
      'contact.message': 'Повідомлення',
      'contact.send': 'Надіслати повідомлення',
      'contact.sent': 'Дякуємо: форма демонстраційна й нічого не надсилає.',

      'footer.contacts': 'Контакти',
      'footer.returns': 'Повернення та відшкодування',
      'footer.terms': 'Умови та положення',
      'footer.privacy': 'Політика приватності',
      'footer.legal': '© 2026 Nymphai Cosmetics · Лінія Dafne · Усі права захищено',
      'footer.demo': 'Демонстраційна реконструкція з навчальною метою. Фотографії та реєстраційні дані компанії замінено на заглушки.',
      'footer.nav': 'Правова інформація',

      'legal.placeholder.tag': 'Документ-заглушка',
      'legal.placeholder.text': 'Ця сторінка — порожній шаблон. Текст нижче лише перелічує розділи, які має містити справжній документ: його потрібно повністю замінити текстом, підготовленим власником або юридичним радником, до будь-якої публікації.',
      'legal.contact.title': 'Контакти',
      'legal.contact.text': 'Щоб скористатися своїми правами або отримати роз’яснення, скористайтеся',
      'legal.contact.link': 'формою зворотного зв’язку',

      'nf.title': 'Сторінку не знайдено',
      'nf.text': 'Сторінка, яку ви шукали, більше не існує, або адреса змінилася.',
      'nf.cta': 'На головну',
    },

    en: {
      'skip': 'Skip to content',
      'nav.home': 'Home',
      'nav.products': 'Products',
      'nav.brand': 'Brand',
      'nav.cart': 'Cart',
      'nav.lang': 'Language',
      'nav.primary': 'Primary navigation',

      'hero.explore': 'Explore',
      'hero.slide': 'Go to slide',
      'hero.1.title': 'Face Cream',
      'hero.1.caption': 'Comfort',
      'hero.2.title': 'Face Cream',
      'hero.2.caption': 'Hidra Lift',
      'hero.3.title': 'Face Serum',
      'hero.3.caption': 'Illuminante',

      'loader.cta': 'Discover the line',
      'loader.left': 'Nymphai',
      'loader.right': 'Cosmetics',
      'loader.label': 'Loading',

      'manifesto.title': 'A daily gesture that becomes a ritual',
      'manifesto.p1': 'The Dafne line is the first chapter of a daily transformation ritual. Clinically tested skincare, with formulas designed to nourish, regenerate and protect the skin over time.',
      'manifesto.p2': 'Donkey milk, the heart of the formulation, is combined with scientifically selected actives such as collagen, hyaluronic acid and vitamin E — gentle enough for the most sensitive skin, and built to accompany it, day after day, towards a new bloom.',

      'showcase.discover': 'View product',
      'showcase.add': 'Add to cart',
      'showcase.region': 'Dafne line',

      'statement.1a': 'Clinically',
      'statement.1b': 'tested',
      'statement.1c': 'skincare',
      'statement.2': 'Formulas that perform',
      'statement.3a': 'Donkey',
      'statement.3b': 'milk',

      'lineup.eyebrow': 'Dafne Line',
      'lineup.title': 'The complete line',
      'lineup.link': 'All products',

      'catalogue.eyebrow': 'Catalogue',
      'catalogue.title': 'Products',
      'catalogue.lede': 'Four gestures, one line. Clinically tested formulas built around donkey milk and actives selected one by one.',
      'catalogue.all': 'All',
      'catalogue.empty': 'No products in this category yet.',
      'catalogue.filters': 'Filters',

      'pdp.add': 'Add to cart',
      'pdp.back': 'Back to products',
      'pdp.actives': 'Key actives',
      'pdp.ritual': 'The ritual',
      'pdp.texture': 'Texture',
      'pdp.quantity': 'Quantity',
      'pdp.increase': 'Increase quantity',
      'pdp.decrease': 'Decrease quantity',
      'pdp.faq1.q': 'Is it suitable for sensitive skin?',
      'pdp.faq1.a': 'Yes. Every Dafne formula is dermatologically tested on sensitive skin and formulated without harsh fragrance.',
      'pdp.faq2.q': 'How long until I see results?',
      'pdp.faq2.a': 'Comfort improves immediately. For tone and evenness we recommend a full eight-week cycle.',
      'pdp.faq3.q': 'How should I store it?',
      'pdp.faq3.a': 'At room temperature, away from heat and direct light. Use within twelve months of opening.',

      'cart.title': 'Cart',
      'cart.empty': 'Your cart is empty.',
      'cart.continue': 'Discover the line',
      'cart.subtotal': 'Subtotal',
      'cart.shipping': 'Shipping',
      'cart.shipping.free': 'Complimentary',
      'cart.total': 'Total',
      'cart.checkout': 'Go to checkout',
      'cart.remove': 'Remove',
      'cart.note': 'Free shipping on orders above €49. Returns accepted within 14 days.',
      'cart.added': 'Added to cart',
      'cart.demo': 'This is a demonstration storefront: checkout is not connected to any payment system.',

      'brand.eyebrow': 'The brand',
      'brand.title': 'Nymphai Cosmetics',
      'brand.lede': 'Skincare that pairs the gentleness of donkey milk with the rigour of pharmaceutical research.',
      'brand.story.title': 'From ingredient to ritual',
      'brand.story.p1': 'Nymphai began with a simple idea: take an ancient ingredient — donkey milk — and put it through the method of contemporary skincare. No inflated promises, no formulation shortcuts.',
      'brand.story.p2': 'Every product in the Dafne line is developed in the lab, clinically tested, and released only once the results are measurable. The rest — the gesture, the light, the time you give yourself — is yours.',
      'brand.pillars.title': 'Three principles',
      'brand.pillar1.title': 'Clinically tested',
      'brand.pillar1.text': 'Each formula completes a dermatological testing protocol on sensitive skin before it enters production.',
      'brand.pillar2.title': 'Formulas that perform',
      'brand.pillar2.text': 'Declared active percentages, no fillers. Collagen, hyaluronic acid and vitamin E at useful concentrations.',
      'brand.pillar3.title': 'Donkey milk',
      'brand.pillar3.text': 'Rich in phospholipids, vitamins A and E and essential fatty acids: it nourishes without occluding, even reactive skin.',
      'brand.cta': 'Discover the Dafne line',

      'contact.eyebrow': 'Contact',
      'contact.title': 'Let’s talk',
      'contact.lede': 'Questions about the line, the formulation or an order: write to us and we reply within two working days.',
      'contact.name': 'Full name',
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.send': 'Send message',
      'contact.sent': 'Thank you — this form is a demo and sends nothing.',

      'footer.contacts': 'Contact',
      'footer.returns': 'Returns and refunds',
      'footer.terms': 'Terms and conditions',
      'footer.privacy': 'Privacy Policy',
      'footer.legal': '© 2026 Nymphai Cosmetics · Dafne Line · All rights reserved',
      'footer.demo': 'A demonstration reconstruction built for study. Photography and company details are placeholders.',
      'footer.nav': 'Legal',

      'legal.placeholder.tag': 'Placeholder document',
      'legal.placeholder.text': 'This page is an empty template. The text below only lists the sections a real document must contain: it has to be replaced in full with wording prepared by the owner or their legal adviser before any publication.',
      'legal.contact.title': 'Contact',
      'legal.contact.text': 'To exercise your rights or ask for clarification, use the',
      'legal.contact.link': 'contact form',

      'nf.title': 'Page not found',
      'nf.text': 'The page you were looking for no longer exists, or the address has changed.',
      'nf.cta': 'Back to home',
    },
  };

  /* A language stored by an earlier build (or hand-edited) must not break the
     site, so anything outside LANGS falls back to the default. */
  function initial() {
    const saved = storage.get(KEY, null);
    if (LANGS.indexOf(saved) !== -1) return saved;
    const attr = document.documentElement.lang;
    return LANGS.indexOf(attr) !== -1 ? attr : DEFAULT;
  }

  let lang = initial();

  const t = (key) => (DICT[lang] && DICT[lang][key]) || DICT[DEFAULT][key] || key;

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
      // Writing textContent discards the per-word spans a split headline needs,
      // so mark it for re-splitting on the reveal pass that follows.
      if (el.hasAttribute('data-split')) {
        delete el.dataset.splitDone;
        el.dataset.reveal = '';
      }
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang__btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });
  }

  function set(next) {
    if (LANGS.indexOf(next) === -1 || next === lang) return;
    lang = next;
    storage.set(KEY, lang);
    apply();
    emit('lang:change', { lang });
  }

  function init() {
    apply();
    document.querySelectorAll('.lang__btn').forEach((btn) => {
      btn.addEventListener('click', () => set(btn.dataset.lang));
    });
  }

  NY.i18n = { t, set, apply, init, langs: LANGS.slice(), get lang() { return lang; } };
})(window.NY);
