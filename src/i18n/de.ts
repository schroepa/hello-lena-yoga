export const ui = {
  'nav.ueber': 'Über mich',
  'nav.angebote': 'Angebote',
  'nav.blog': 'Blog',
  'nav.kontakt': 'Kontakt',
  'nav.lang': 'EN',
  'nav.lang.label': 'Switch to English',
  'hero.headline': 'Yoga für alle Körper.',
  'hero.subline': 'Ein Raum für dich — so wie du bist.',
  'hero.cta': 'Kurse entdecken',
  'hero.cta.href': '/de/angebote',
  'safespace.statement': 'Hier bist du willkommen.\nMit allem, was du mitbringst.',
  'courses.title': 'Aktuelle Kurse',
  'courses.cta': 'Alle Kurse',
  'courses.cta.href': '/de/angebote',
  'blog.title': 'Aus dem Blog',
  'blog.cta': 'Alle Beiträge',
  'blog.cta.href': '/de/blog',
  'footer.imprint': 'Impressum',
  'footer.privacy': 'Datenschutz',
  'footer.tagline': 'Yin Yoga · Body Positive · Safe Space',
} as const;

export type UIKey = keyof typeof ui;
