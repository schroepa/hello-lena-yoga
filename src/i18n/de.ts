export const ui = {
  'nav.ueber': 'ÜBER MICH',
  'nav.angebote': 'ANGEBOTE',
  'nav.blog': 'BLOG',
  'nav.kontakt': 'KONTAKT',
  'nav.lang': 'EN',
  'nav.lang.label': 'Switch to English',
  'hero.headline': 'YOGA FÜR\nALLE KÖRPER.',
  'hero.label': 'Yin Yoga · Berlin',
  'hero.cta': 'KURSE ENTDECKEN',
  'hero.cta.href': '/de/angebote',
  'safespace.statement': 'Hier bist du willkommen.\nMit allem, was du mitbringst.',
  'courses.title': 'AKTUELLE KURSE',
  'courses.cta': 'ALLE KURSE',
  'courses.cta.href': '/de/angebote',
  'blog.title': 'AUS DEM BLOG',
  'blog.cta': 'ALLE BEITRÄGE',
  'blog.cta.href': '/de/blog',
  'footer.imprint': 'Impressum',
  'footer.privacy': 'Datenschutz',
  'footer.tagline': 'Yin Yoga · Body Positive · Safe Space',
} as const;

export type UIKey = keyof typeof ui;
