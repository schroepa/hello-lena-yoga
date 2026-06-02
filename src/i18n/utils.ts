import { ui as de, type UIKey } from './de';
import { ui as en } from './en';

export type Lang = 'de' | 'en';

const translations = { de, en } as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'de';
}

export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return translations[lang][key] ?? translations['de'][key];
  };
}

export function getLocalizedPath(lang: Lang): Record<string, string> {
  return {
    ueber: lang === 'de' ? '/de/ueber-mich' : '/en/about',
    angebote: lang === 'de' ? '/de/angebote' : '/en/offerings',
    blog: lang === 'de' ? '/de/blog' : '/en/blog',
    kontakt: lang === 'de' ? '/de/kontakt' : '/en/contact',
    home: `/${lang}/`,
    other: lang === 'de' ? '/en/' : '/de/',
  };
}
