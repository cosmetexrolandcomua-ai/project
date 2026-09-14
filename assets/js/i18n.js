/* =========================================================================
   IT / EN switching for the whole site.

   Markup opts in with:
     <span data-i18n="nav.products">Prodotti</span>
     <input data-i18n-attr="placeholder:form.email">
   Modules that render from data listen for the `lang:change` event.
   ========================================================================= */
(function (NY) {
  'use strict';

  const { storage, emit } = NY.util;
  const KEY = 'nymphai:lang';

  const DICT = {
    it: {
      'skip': 'Vai al contenuto',
      'nav.home': 'Home',
      'nav.products': 'Prodotti',
      'nav.brand': 'Brand',
      'nav.cart': 'Carrello',

      'hero.explore': 'Explore',
      'hero.slide': 'Vai alla slide',
      'hero.1.title': 'Crema Viso',
      'hero.1.caption': 'Comfort',
      'hero.2.title': 'Crema Viso',
      'hero.2.caption': 'Hidra Lift',
      'hero.3.title': 'Siero Viso',
      'hero.3.caption': 'Illuminante',

      'loader.cta': 'Scopri la linea',
      'loader.left': 'Nymphai',
      'loader.right': 'Cosmetics',

      'manifesto.title': 'Un gesto quotidiano che diventa rituale',
      'manifesto.p1': 'La linea Dafne nasce come il primo capitolo di un rituale di trasformazione quotidiana. Una cosmesi clinicamente testata, con formule studiate per nutrire, rigenerare e proteggere la pelle nel tempo.',
      'manifesto.p2': 'Il latte d’asina, cuore della formulazione, si unisce ad attivi scientificamente selezionati come collagene, acido ialuronico e vitamina E, per rispettare anche le pelli più sensibili e accompagnarle, giorno dopo giorno, verso una nuova fioritura.',

      'showcase.discover': 'Scopri il prodotto',
      'showcase.add': 'Aggiungi',

      'statement.1a': 'Cosmesi',
      'statement.1b': 'clinicamente',
      'statement.1c': 'testata',
      'statement.2': 'Formule performanti',
      'statement.3a': 'Latte',
      'statement.3b': 'd’asina',

      'lineup.eyebrow': 'Linea Dafne',
      'lineup.title': 'La linea completa',
      'lineup.link': 'Tutti i prodotti',

      'catalogue.eyebrow': 'Catalogo',
      'catalogue.title': 'Prodotti',
      'catalogue.lede': 'Quattro gesti, una sola linea. Formule clinicamente testate, costruite attorno al latte d’asina e ad attivi selezionati uno a uno.',
      'catalogue.all': 'Tutti',
      'catalogue.empty': 'Nessun prodotto in questa categoria.',

      'pdp.add': 'Aggiungi al carrello',
      'pdp.back': 'Torna ai prodotti',
      'pdp.actives': 'Attivi principali',
      'pdp.ritual': 'Il rituale',
      'pdp.texture': 'Texture',
      'pdp.quantity': 'Quantità',
      'pdp.increase': 'Aumenta quantità',
      'pdp.decrease': 'Diminuisci quantità',
      'pdp.faq': 'Domande frequenti',
      'pdp.faq1.q': 'È adatto alle pelli sensibili?',
      'pdp.faq1.a': 'Sì. Tutte le formule Dafne sono dermatologicamente testate su pelli sensibili e formulate senza profumazioni aggressive.',
      'pdp.faq2.q': 'In quanto tempo si vedono i risultati?',
      'pdp.faq2.a': 'I primi effetti sul comfort cutaneo sono immediati. Per tono ed uniformità si consiglia un ciclo completo di otto settimane.',
      'pdp.faq3.q': 'Come conservo il prodotto?',
      'pdp.faq3.a': 'A temperatura ambiente, lontano da fonti di calore e dalla luce diretta. Da consumare entro dodici mesi dall’apertura.',

      'cart.title': 'Carrello',
      'cart.empty': 'Il tuo carrello è vuoto.',
      'cart.continue': 'Scopri la linea',
      'cart.subtotal': 'Subtotale',
      'cart.shipping': 'Spedizione',
      'cart.shipping.free': 'Offerta',
      'cart.total': 'Totale',
      'cart.checkout': 'Vai al checkout',
      'cart.remove': 'Rimuovi',
      'cart.note': 'Spedizione gratuita in Italia per ordini superiori a 49 €. Reso entro 14 giorni.',
      'cart.added': 'Aggiunto al carrello',
      'cart.demo': 'Questa è una vetrina dimostrativa: il checkout non è collegato a nessun sistema di pagamento.',

      'brand.eyebrow': 'Il brand',
      'brand.title': 'Nymphai Cosmetics',
      'brand.lede': 'Una cosmesi che unisce la delicatezza del latte d’asina al rigore della ricerca farmaceutica.',
      'brand.story.title': 'Dall’ingrediente al rituale',
      'brand.story.p1': 'Nymphai nasce da un’idea semplice: riportare al centro un ingrediente antichissimo, il latte d’asina, e sottoporlo al metodo della cosmesi contemporanea. Niente promesse gonfiate, nessuna scorciatoia di formulazione.',
      'brand.story.p2': 'Ogni prodotto della linea Dafne nasce in laboratorio, viene testato clinicamente e arriva alla pelle solo quando i risultati sono misurabili. Il resto — il gesto, la luce, il tempo dedicato a sé — lo mettete voi.',
      'brand.pillars.title': 'Tre principi',
      'brand.pillar1.title': 'Clinicamente testata',
      'brand.pillar1.text': 'Ogni formula completa un protocollo di test dermatologici su pelli sensibili prima di entrare in produzione.',
      'brand.pillar2.title': 'Formule performanti',
      'brand.pillar2.text': 'Percentuali di attivi dichiarate, senza riempitivi. Collagene, acido ialuronico e vitamina E in concentrazioni utili.',
      'brand.pillar3.title': 'Latte d’asina',
      'brand.pillar3.text': 'Ricco di fosfolipidi, vitamine A ed E e acidi grassi essenziali: nutre senza occludere, anche le pelli reattive.',
      'brand.cta': 'Scopri la linea Dafne',

      'contact.eyebrow': 'Contatti',
      'contact.title': 'Parliamone',
      'contact.lede': 'Domande sulla linea, sulla formulazione o su un ordine: scriveteci e rispondiamo entro due giorni lavorativi.',
      'contact.name': 'Nome e cognome',
      'contact.email': 'Email',
      'contact.message': 'Messaggio',
      'contact.send': 'Invia messaggio',
      'contact.sent': 'Grazie: il modulo è dimostrativo e non invia nulla.',

      'footer.contacts': 'Contatti',
      'footer.returns': 'Informativa su resi e rimborsi',
      'footer.terms': 'Termini e condizioni',
      'footer.privacy': 'Privacy Policy',
      'footer.legal': '\u00A9 2026 Nymphai Cosmetics \u00B7 Linea Dafne \u00B7 Tutti i diritti riservati',
      'footer.demo': 'Ricostruzione dimostrativa a scopo didattico. Fotografie e dati societari sostituiti da segnaposto.',

      'legal.updated': 'Ultimo aggiornamento',
      'nf.title': 'Pagina non trovata',
      'nf.text': 'La pagina che cercavate non esiste più, oppure l’indirizzo è cambiato.',
      'nf.cta': 'Torna alla home',
    },

    en: {
      'skip': 'Skip to content',
      'nav.home': 'Home',
      'nav.products': 'Products',
      'nav.brand': 'Brand',
      'nav.cart': 'Cart',

      'hero.explore': 'Explore',
      'hero.slide': 'Go to slide',
      'hero.1.title': 'Face Cream',
      'hero.1.caption': 'Comfort',
      'hero.2.title': 'Face Cream',
      'hero.2.caption': 'Hidra Lift',
      'hero.3.title': 'Face Serum',
      'hero.3.caption': 'Illuminating',

      'loader.cta': 'Discover the line',
      'loader.left': 'Nymphai',
      'loader.right': 'Cosmetics',

      'manifesto.title': 'A daily gesture that becomes a ritual',
      'manifesto.p1': 'The Dafne line is the first chapter of a daily transformation ritual. Clinically tested skincare, with formulas designed to nourish, regenerate and protect the skin over time.',
      'manifesto.p2': 'Donkey milk, the heart of the formulation, is combined with scientifically selected actives such as collagen, hyaluronic acid and vitamin E — gentle enough for the most sensitive skin, and built to accompany it, day after day, towards a new bloom.',

      'showcase.discover': 'Discover the product',
      'showcase.add': 'Add',

      'statement.1a': 'Clinically',
      'statement.1b': 'tested',
      'statement.1c': 'skincare',
      'statement.2': 'High-performance formulas',
      'statement.3a': 'Donkey',
      'statement.3b': 'milk',

      'lineup.eyebrow': 'Dafne Line',
      'lineup.title': 'The complete line',
      'lineup.link': 'All products',

      'catalogue.eyebrow': 'Catalogue',
      'catalogue.title': 'Products',
      'catalogue.lede': 'Four gestures, one line. Clinically tested formulas built around donkey milk and actives selected one by one.',
      'catalogue.all': 'All',
      'catalogue.empty': 'No products in this category.',

      'pdp.add': 'Add to cart',
      'pdp.back': 'Back to products',
      'pdp.actives': 'Key actives',
      'pdp.ritual': 'The ritual',
      'pdp.texture': 'Texture',
      'pdp.quantity': 'Quantity',
      'pdp.increase': 'Increase quantity',
      'pdp.decrease': 'Decrease quantity',
      'pdp.faq': 'Frequently asked',
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
      'cart.note': 'Free shipping within Italy on orders above €49. Returns accepted within 14 days.',
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
      'brand.pillar2.title': 'Performing formulas',
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
      'footer.legal': '\u00A9 2026 Nymphai Cosmetics \u00B7 Dafne Line \u00B7 All rights reserved',
      'footer.demo': 'A demonstration reconstruction built for study. Photography and company details are placeholders.',

      'legal.updated': 'Last updated',
      'nf.title': 'Page not found',
      'nf.text': 'The page you were looking for no longer exists, or the address has changed.',
      'nf.cta': 'Back to home',
    },
  };

  let lang = storage.get(KEY, null) || (document.documentElement.lang === 'en' ? 'en' : 'it');

  const t = (key) => (DICT[lang] && DICT[lang][key]) || (DICT.it[key] || key);

  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
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
    if (next !== 'it' && next !== 'en') return;
    if (next === lang) return;
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

  NY.i18n = { t, set, apply, init, get lang() { return lang; } };
})(window.NY);
