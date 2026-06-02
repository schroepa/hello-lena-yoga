# Startseite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vollständige, mehrsprachige (DE/EN) Startseite mit Dark Mode, Breath-Transition, Navigation und allen Homepage-Sektionen.

**Architecture:** Astro SSG mit React Islands nur für interaktive Komponenten (Header, ThemeToggle). Alle Sektionen sind statische Astro-Komponenten. i18n via Astro built-in Routing mit Strings in separaten TS-Dateien.

**Tech Stack:** Astro 6, React 19, Tailwind v4, shadcn/ui, Fraunces Variable + Geist Variable, lucide-react

---

## File Map

| Datei | Aktion | Verantwortung |
|---|---|---|
| `astro.config.mjs` | Modify | i18n-Routing aktivieren |
| `src/styles/global.css` | Modify | Fraunces-Import, Farbtokens, Breath-Animation |
| `src/pages/index.astro` | Modify | Redirect → /de/ |
| `src/layouts/Base.astro` | Create | HTML-Shell, Meta, Dark-Mode-Init-Script |
| `src/i18n/de.ts` | Create | Deutsche UI-Strings |
| `src/i18n/en.ts` | Create | Englische UI-Strings |
| `src/i18n/utils.ts` | Create | getLangFromUrl, useTranslations |
| `src/content/config.ts` | Create | Content Collections Schema (blog + kurse) |
| `src/content/blog/de/willkommen.md` | Create | Platzhalter-Blogpost DE |
| `src/content/blog/en/welcome.md` | Create | Platzhalter-Blogpost EN |
| `src/content/kurse/de/yin-yoga-grundlagen.md` | Create | Platzhalter-Kurs DE |
| `src/content/kurse/en/yin-yoga-basics.md` | Create | Platzhalter-Kurs EN |
| `src/components/layout/ThemeToggle.tsx` | Create | Breath-Animation, localStorage |
| `src/components/layout/Header.tsx` | Create | Navigation, Sprachwechsel, Mobile Sheet |
| `src/components/layout/Footer.astro` | Create | Links, Kontakt, Legal |
| `src/components/sections/Hero.astro` | Create | Headline, Subline, CTA |
| `src/components/sections/SafeSpaceStatement.astro` | Create | Kernaussage, Neon-Akzent |
| `src/components/sections/CourseTeaser.astro` | Create | 2–3 Kurs-Karten |
| `src/components/sections/BlogTeaser.astro` | Create | 1–2 Blog-Previews |
| `src/pages/de/index.astro` | Create | Deutsche Startseite |
| `src/pages/en/index.astro` | Create | Englische Startseite |

---

## Task 1: Font installieren & i18n-Config

**Files:**
- Modify: `package.json` (via npm)
- Modify: `astro.config.mjs`

- [ ] **Schritt 1: Fraunces installieren**

```bash
cd /Users/ptrck/Documents/yoga-website
npm install @fontsource-variable/fraunces
```

Expected: `package.json` enthält `"@fontsource-variable/fraunces"` in dependencies.

- [ ] **Schritt 2: i18n zu astro.config.mjs hinzufügen**

Ersetze den gesamten Inhalt von `astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Schritt 3: Verify**

```bash
npx astro check
```

Expected: Keine Fehler (ggf. Warnungen wegen noch fehlender Dateien — OK).

- [ ] **Schritt 4: Commit**

```bash
git add astro.config.mjs package.json package-lock.json
git commit -m "feat: install Fraunces font, enable i18n routing"
```

---

## Task 2: Design Tokens & Breath-Animation

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Schritt 1: global.css ersetzen**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";
@import "@fontsource-variable/fraunces";

@custom-variant dark (&:is(.dark *));

@theme inline {
    --font-heading: 'Fraunces Variable', serif;
    --font-sans: 'Geist Variable', sans-serif;
    --color-sidebar-ring: var(--sidebar-ring);
    --color-sidebar-border: var(--sidebar-border);
    --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
    --color-sidebar-accent: var(--sidebar-accent);
    --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
    --color-sidebar-primary: var(--sidebar-primary);
    --color-sidebar-foreground: var(--sidebar-foreground);
    --color-sidebar: var(--sidebar);
    --color-ring: var(--ring);
    --color-input: var(--input);
    --color-border: var(--border);
    --color-destructive: var(--destructive);
    --color-accent-foreground: var(--accent-foreground);
    --color-accent: var(--accent);
    --color-muted-foreground: var(--muted-foreground);
    --color-muted: var(--muted);
    --color-secondary-foreground: var(--secondary-foreground);
    --color-secondary: var(--secondary);
    --color-primary-foreground: var(--primary-foreground);
    --color-primary: var(--primary);
    --color-popover-foreground: var(--popover-foreground);
    --color-popover: var(--popover);
    --color-card-foreground: var(--card-foreground);
    --color-card: var(--card);
    --color-foreground: var(--foreground);
    --color-background: var(--background);
    --radius-sm: calc(var(--radius) * 0.6);
    --radius-md: calc(var(--radius) * 0.8);
    --radius-lg: var(--radius);
    --radius-xl: calc(var(--radius) * 1.4);
}

:root {
    --background: oklch(0.98 0.008 80);
    --foreground: oklch(0.15 0.01 60);
    --card: oklch(0.96 0.008 80);
    --card-foreground: oklch(0.15 0.01 60);
    --popover: oklch(0.98 0.008 80);
    --popover-foreground: oklch(0.15 0.01 60);
    --primary: oklch(0.72 0.20 130);
    --primary-foreground: oklch(0.15 0.01 60);
    --secondary: oklch(0.93 0.008 80);
    --secondary-foreground: oklch(0.15 0.01 60);
    --muted: oklch(0.93 0.006 80);
    --muted-foreground: oklch(0.50 0.01 70);
    --accent: oklch(0.93 0.008 80);
    --accent-foreground: oklch(0.15 0.01 60);
    --destructive: oklch(0.577 0.245 27.325);
    --border: oklch(0.88 0.008 80);
    --input: oklch(0.88 0.008 80);
    --ring: oklch(0.72 0.20 130);
    --radius: 0.75rem;
    --sidebar: oklch(0.96 0.008 80);
    --sidebar-foreground: oklch(0.15 0.01 60);
    --sidebar-primary: oklch(0.72 0.20 130);
    --sidebar-primary-foreground: oklch(0.15 0.01 60);
    --sidebar-accent: oklch(0.93 0.008 80);
    --sidebar-accent-foreground: oklch(0.15 0.01 60);
    --sidebar-border: oklch(0.88 0.008 80);
    --sidebar-ring: oklch(0.72 0.20 130);
}

.dark {
    --background: oklch(0.14 0.015 60);
    --foreground: oklch(0.95 0.008 80);
    --card: oklch(0.18 0.015 60);
    --card-foreground: oklch(0.95 0.008 80);
    --popover: oklch(0.18 0.015 60);
    --popover-foreground: oklch(0.95 0.008 80);
    --primary: oklch(0.80 0.22 130);
    --primary-foreground: oklch(0.10 0.01 60);
    --secondary: oklch(0.22 0.015 60);
    --secondary-foreground: oklch(0.95 0.008 80);
    --muted: oklch(0.22 0.015 60);
    --muted-foreground: oklch(0.65 0.01 70);
    --accent: oklch(0.22 0.015 60);
    --accent-foreground: oklch(0.95 0.008 80);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.80 0.22 130);
    --sidebar: oklch(0.18 0.015 60);
    --sidebar-foreground: oklch(0.95 0.008 80);
    --sidebar-primary: oklch(0.80 0.22 130);
    --sidebar-primary-foreground: oklch(0.10 0.01 60);
    --sidebar-accent: oklch(0.22 0.015 60);
    --sidebar-accent-foreground: oklch(0.95 0.008 80);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: oklch(0.80 0.22 130);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}

/* Breath theme transition */
html.theme-breath {
  animation: theme-breath 0.32s ease-in-out;
}

@keyframes theme-breath {
  0%   { opacity: 1; transform: scale(1); }
  40%  { opacity: 0.82; transform: scale(0.9985); }
  100% { opacity: 1; transform: scale(1); }
}

/* Smooth color transitions */
html {
  transition: background-color 0.32s ease, color 0.32s ease;
}
```

- [ ] **Schritt 2: Verify Build**

```bash
npx astro build 2>&1 | tail -5
```

Expected: Build completes (evtl. Warnungen wegen fehlender Seiten — OK).

- [ ] **Schritt 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: warm color palette, Fraunces heading font, breath animation tokens"
```

---

## Task 3: i18n Strings & Utils

**Files:**
- Create: `src/i18n/de.ts`
- Create: `src/i18n/en.ts`
- Create: `src/i18n/utils.ts`

- [ ] **Schritt 1: src/i18n/de.ts erstellen**

```ts
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
```

- [ ] **Schritt 2: src/i18n/en.ts erstellen**

```ts
import type { UIKey } from './de';

export const ui: Record<UIKey, string> = {
  'nav.ueber': 'About',
  'nav.angebote': 'Offerings',
  'nav.blog': 'Blog',
  'nav.kontakt': 'Contact',
  'nav.lang': 'DE',
  'nav.lang.label': 'Auf Deutsch wechseln',
  'hero.headline': 'Yoga for every body.',
  'hero.subline': 'A space for you — just as you are.',
  'hero.cta': 'Discover classes',
  'hero.cta.href': '/en/offerings',
  'safespace.statement': 'You are welcome here.\nWith everything you bring.',
  'courses.title': 'Current classes',
  'courses.cta': 'All classes',
  'courses.cta.href': '/en/offerings',
  'blog.title': 'From the blog',
  'blog.cta': 'All posts',
  'blog.cta.href': '/en/blog',
  'footer.imprint': 'Imprint',
  'footer.privacy': 'Privacy',
  'footer.tagline': 'Yin Yoga · Body Positive · Safe Space',
};
```

- [ ] **Schritt 3: src/i18n/utils.ts erstellen**

```ts
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
```

- [ ] **Schritt 4: TypeScript prüfen**

```bash
npx astro check
```

Expected: Keine Fehler in den i18n-Dateien.

- [ ] **Schritt 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: i18n strings and utils for DE/EN"
```

---

## Task 4: Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/de/willkommen.md`
- Create: `src/content/blog/en/welcome.md`
- Create: `src/content/kurse/de/yin-yoga-grundlagen.md`
- Create: `src/content/kurse/en/yin-yoga-basics.md`

- [ ] **Schritt 1: src/content/config.ts erstellen**

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['de', 'en']),
    draft: z.boolean().default(false),
  }),
});

const kurse = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    level: z.enum(['alle', 'anfänger', 'fortgeschritten']),
    duration: z.number(),
    lang: z.enum(['de', 'en']),
    order: z.number(),
    active: z.boolean().default(true),
  }),
});

export const collections = { blog, kurse };
```

- [ ] **Schritt 2: src/content/blog/de/willkommen.md erstellen**

```md
---
title: "Willkommen in meinem Raum"
description: "Ein erster Einblick in das, was dich hier erwartet — und was Yoga für mich bedeutet."
pubDate: 2026-06-01
tags: ["anfang", "yin yoga", "safe space"]
lang: de
draft: false
---

Ich freue mich, dass du hier bist.

Yin Yoga ist für mich kein Sport — es ist eine Einladung. Eine Einladung, innezuhalten, den Atem zu beobachten, und dem Körper zuzuhören, der so viel zu sagen hat, wenn wir ihm Raum geben.

In meinen Kursen gibt es kein Richtig und kein Falsch. Kein Körper, der zu wenig oder zu viel ist. Nur du, deine Matte, und die Stille zwischen den Atemzügen.
```

- [ ] **Schritt 3: src/content/blog/en/welcome.md erstellen**

```md
---
title: "Welcome to my space"
description: "A first glimpse of what awaits you here — and what yoga means to me."
pubDate: 2026-06-01
tags: ["beginnings", "yin yoga", "safe space"]
lang: en
draft: false
---

I'm glad you're here.

Yin Yoga, for me, is not a sport — it's an invitation. An invitation to pause, to watch the breath, and to listen to a body that has so much to say when we give it space.

In my classes, there is no right or wrong. No body that is too little or too much. Just you, your mat, and the quiet between breaths.
```

- [ ] **Schritt 4: src/content/kurse/de/yin-yoga-grundlagen.md erstellen**

```md
---
title: "Yin Yoga Grundlagen"
description: "Ein sanfter Einstieg in die Welt des Yin Yoga. Wir halten Positionen länger, arbeiten mit dem Bindegewebe und finden Raum für Stille."
shortDescription: "Sanft, tief, für alle Körper."
level: alle
duration: 75
lang: de
order: 1
active: true
---

Yin Yoga ist die Kunst des Loslassens. Positionen werden 3–5 Minuten gehalten, das Bindegewebe öffnet sich, der Geist findet Ruhe.

Keine Voraussetzungen. Keine Leistungserwartung. Nur ankommen.
```

- [ ] **Schritt 5: src/content/kurse/en/yin-yoga-basics.md erstellen**

```md
---
title: "Yin Yoga Basics"
description: "A gentle introduction to the world of Yin Yoga. We hold poses longer, work with connective tissue and find space for stillness."
shortDescription: "Gentle, deep, for every body."
level: alle
duration: 75
lang: en
order: 1
active: true
---

Yin Yoga is the art of letting go. Poses are held for 3–5 minutes, connective tissue softens, the mind finds rest.

No prerequisites. No performance expected. Just arriving.
```

- [ ] **Schritt 6: Verify**

```bash
npx astro check
```

Expected: Keine Fehler in den Content Collections.

- [ ] **Schritt 7: Commit**

```bash
git add src/content/
git commit -m "feat: content collections schema and placeholder content DE/EN"
```

---

## Task 5: Base Layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Schritt 1: src/layouts/Base.astro erstellen**

```astro
---
import '../styles/global.css';
import { Header } from '../components/layout/Header';
import Footer from '../components/layout/Footer.astro';
import { getLangFromUrl, getLocalizedPath, useTranslations } from '../i18n/utils';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Yin Yoga mit Lena – ein Safe Space für alle Körper.' } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const paths = getLocalizedPath(lang);

const nav = [
  { href: paths.ueber, label: t('nav.ueber') },
  { href: paths.angebote, label: t('nav.angebote') },
  { href: paths.blog, label: t('nav.blog') },
  { href: paths.kontakt, label: t('nav.kontakt') },
];
---

<!DOCTYPE html>
<html lang={lang} class="scroll-smooth">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="generator" content={Astro.generator} />
    <title>{title} · Lena Yoga</title>
    <meta name="description" content={description} />
    <script is:inline>
      (function () {
        const stored = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      })();
    </script>
  </head>
  <body>
    <Header
      client:load
      currentLang={lang}
      otherLangHref={paths.other}
      otherLangLabel={t('nav.lang')}
      otherLangAriaLabel={t('nav.lang.label')}
      nav={nav}
    />
    <main>
      <slot />
    </main>
    <Footer
      lang={lang}
      imprintLabel={t('footer.imprint')}
      privacyLabel={t('footer.privacy')}
      tagline={t('footer.tagline')}
    />
  </body>
</html>
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Fehler wegen fehlender Header/Footer-Komponenten — diese kommen in Task 6–8.

- [ ] **Schritt 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: Base layout with i18n, dark mode init script"
```

---

## Task 6: ThemeToggle Komponente

**Files:**
- Create: `src/components/layout/ThemeToggle.tsx`

- [ ] **Schritt 1: src/components/layout/ThemeToggle.tsx erstellen**

```tsx
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored === 'dark' || stored === 'light'
      ? stored
      : prefersDark ? 'dark' : 'light';
    setTheme(initial);
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';

    const html = document.documentElement;
    html.classList.add('theme-breath');
    const onEnd = () => {
      html.classList.remove('theme-breath');
      html.removeEventListener('animationend', onEnd);
    };
    html.addEventListener('animationend', onEnd);

    html.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    setTheme(next);
  }

  if (theme === null) return <div className="w-5 h-5" aria-hidden />;

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'light' ? 'Dunkelmodus aktivieren' : 'Hellmodus aktivieren'}
      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d={theme === 'dark'
            ? 'M9 1.5 A7.5 7.5 0 0 1 9 16.5 A7.5 7.5 0 0 1 9 1.5 Z'
            : 'M9 1.5 A7.5 7.5 0 0 0 9 16.5 A7.5 7.5 0 0 0 9 1.5 Z'
          }
          fill="currentColor"
          className="transition-all duration-300"
        />
      </svg>
    </button>
  );
}
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Keine Fehler in ThemeToggle.tsx.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/layout/ThemeToggle.tsx
git commit -m "feat: ThemeToggle with breath animation and half-circle icon"
```

---

## Task 7: Header Komponente

**Files:**
- Create: `src/components/layout/Header.tsx`

- [ ] **Schritt 1: src/components/layout/Header.tsx erstellen**

```tsx
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';

interface NavItem {
  href: string;
  label: string;
}

interface Props {
  currentLang: 'de' | 'en';
  otherLangHref: string;
  otherLangLabel: string;
  otherLangAriaLabel: string;
  nav: NavItem[];
}

export function Header({ currentLang, otherLangHref, otherLangLabel, otherLangAriaLabel, nav }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href={`/${currentLang}/`}
          className="font-heading text-2xl font-semibold tracking-tight hover:text-primary transition-colors"
        >
          Lena
        </a>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Hauptnavigation">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href={otherLangHref}
            aria-label={otherLangAriaLabel}
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            {otherLangLabel}
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile navigation */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <button
                aria-label={currentLang === 'de' ? 'Menü öffnen' : 'Open menu'}
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted transition-colors"
              >
                <Menu size={18} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-12">
              <nav className="flex flex-col gap-6" aria-label="Mobile Navigation">
                {nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href={otherLangHref}
                  aria-label={otherLangAriaLabel}
                  className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {otherLangLabel}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Keine Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: Header with scroll behavior, mobile Sheet, language switcher"
```

---

## Task 8: Footer Komponente

**Files:**
- Create: `src/components/layout/Footer.astro`

- [ ] **Schritt 1: src/components/layout/Footer.astro erstellen**

```astro
---
interface Props {
  lang: 'de' | 'en';
  imprintLabel: string;
  privacyLabel: string;
  tagline: string;
}

const { lang, imprintLabel, privacyLabel, tagline } = Astro.props;
---

<footer class="border-t border-border mt-24">
  <div class="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="font-heading text-lg font-medium">Lena Yoga</p>
    <p class="text-sm text-muted-foreground text-center">{tagline}</p>
    <nav class="flex items-center gap-5 text-sm text-muted-foreground" aria-label="Footer Navigation">
      <a href={`/${lang}/impressum`} class="hover:text-foreground transition-colors">
        {imprintLabel}
      </a>
      <a href={`/${lang}/datenschutz`} class="hover:text-foreground transition-colors">
        {privacyLabel}
      </a>
    </nav>
  </div>
</footer>
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Keine Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/layout/Footer.astro
git commit -m "feat: Footer with tagline and legal links"
```

---

## Task 9: Hero Sektion

**Files:**
- Create: `src/components/sections/Hero.astro`

- [ ] **Schritt 1: src/components/sections/Hero.astro erstellen**

```astro
---
interface Props {
  headline: string;
  subline: string;
  ctaLabel: string;
  ctaHref: string;
}

const { headline, subline, ctaLabel, ctaHref } = Astro.props;
---

<section class="min-h-svh flex items-center justify-start px-6 pt-20">
  <div class="max-w-6xl mx-auto w-full">
    <div class="max-w-3xl">
      <h1 class="font-heading text-6xl sm:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight mb-8">
        {headline}
      </h1>
      <p class="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-md">
        {subline}
      </p>
      <a
        href={ctaHref}
        class="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {ctaLabel}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Keine Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/sections/Hero.astro
git commit -m "feat: Hero section with headline, subline, CTA"
```

---

## Task 10: Safe Space Statement

**Files:**
- Create: `src/components/sections/SafeSpaceStatement.astro`

- [ ] **Schritt 1: src/components/sections/SafeSpaceStatement.astro erstellen**

```astro
---
interface Props {
  statement: string;
}

const { statement } = Astro.props;
const lines = statement.split('\n');
---

<section class="px-6 py-24 sm:py-32">
  <div class="max-w-6xl mx-auto">
    <p class="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] max-w-2xl">
      {lines.map((line, i) => (
        <>
          {i === lines.length - 1
            ? <span class="relative inline-block">
                {line}
                <span
                  class="absolute bottom-1 left-0 w-full h-[3px] bg-primary rounded-full"
                  aria-hidden="true"
                />
              </span>
            : <>{line}<br /></>
          }
        </>
      ))}
    </p>
  </div>
</section>
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Keine Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/sections/SafeSpaceStatement.astro
git commit -m "feat: SafeSpaceStatement with neon-lime underline accent"
```

---

## Task 11: Kurs-Teaser Sektion

**Files:**
- Create: `src/components/sections/CourseTeaser.astro`

- [ ] **Schritt 1: src/components/sections/CourseTeaser.astro erstellen**

```astro
---
import { getCollection } from 'astro:content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Props {
  lang: 'de' | 'en';
  title: string;
  ctaLabel: string;
  ctaHref: string;
}

const { lang, title, ctaLabel, ctaHref } = Astro.props;

const allKurse = await getCollection('kurse');
const kurse = allKurse
  .filter(k => k.data.lang === lang && k.data.active)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3);
---

<section class="px-6 py-16 sm:py-24 bg-muted/40">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-10">
      <h2 class="font-heading text-3xl sm:text-4xl font-semibold">{title}</h2>
      <a href={ctaHref} class="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
        {ctaLabel} →
      </a>
    </div>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {kurse.map(kurs => (
        <Card class="border-border bg-card hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle class="font-heading text-xl font-medium">{kurs.data.title}</CardTitle>
            <CardDescription>{kurs.data.shortDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground mb-4">{kurs.data.description}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-muted-foreground">{kurs.data.duration} min</span>
              <a
                href={`/${lang}/angebote/${kurs.slug.split('/').pop()}`}
                class="text-xs text-primary hover:underline font-medium"
              >
                {lang === 'de' ? 'Mehr erfahren' : 'Learn more'} →
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div class="mt-8 sm:hidden">
      <a href={ctaHref} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {ctaLabel} →
      </a>
    </div>
  </div>
</section>
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Keine Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/sections/CourseTeaser.astro
git commit -m "feat: CourseTeaser from content collections"
```

---

## Task 12: Blog-Teaser Sektion

**Files:**
- Create: `src/components/sections/BlogTeaser.astro`

- [ ] **Schritt 1: src/components/sections/BlogTeaser.astro erstellen**

```astro
---
import { getCollection } from 'astro:content';

interface Props {
  lang: 'de' | 'en';
  title: string;
  ctaLabel: string;
  ctaHref: string;
}

const { lang, title, ctaLabel, ctaHref } = Astro.props;

const allPosts = await getCollection('blog');
const posts = allPosts
  .filter(p => p.data.lang === lang && !p.data.draft)
  .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
  .slice(0, 2);

const dateFormatter = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
---

<section class="px-6 py-16 sm:py-24">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-10">
      <h2 class="font-heading text-3xl sm:text-4xl font-semibold">{title}</h2>
      <a href={ctaHref} class="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
        {ctaLabel} →
      </a>
    </div>

    <div class="divide-y divide-border">
      {posts.map(post => (
        <article class="py-6 group">
          <a href={`/${lang}/blog/${post.slug.split('/').pop()}`} class="flex items-start justify-between gap-6">
            <div>
              <h3 class="font-heading text-xl font-medium group-hover:text-primary transition-colors mb-1">
                {post.data.title}
              </h3>
              <p class="text-sm text-muted-foreground leading-relaxed">
                {post.data.description}
              </p>
            </div>
            <time
              datetime={post.data.pubDate.toISOString()}
              class="text-xs text-muted-foreground whitespace-nowrap pt-1 shrink-0"
            >
              {dateFormatter.format(post.data.pubDate)}
            </time>
          </a>
        </article>
      ))}
    </div>

    <div class="mt-6 sm:hidden">
      <a href={ctaHref} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {ctaLabel} →
      </a>
    </div>
  </div>
</section>
```

- [ ] **Schritt 2: Verify**

```bash
npx astro check
```

Expected: Keine Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/sections/BlogTeaser.astro
git commit -m "feat: BlogTeaser from content collections with date formatting"
```

---

## Task 13: Seiten & Redirect

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/de/index.astro`
- Create: `src/pages/en/index.astro`

- [ ] **Schritt 1: src/pages/index.astro ersetzen (Redirect)**

```astro
---
return Astro.redirect('/de/', 301);
---
```

- [ ] **Schritt 2: src/pages/de/index.astro erstellen**

```astro
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/sections/Hero.astro';
import SafeSpaceStatement from '../../components/sections/SafeSpaceStatement.astro';
import CourseTeaser from '../../components/sections/CourseTeaser.astro';
import BlogTeaser from '../../components/sections/BlogTeaser.astro';
import { useTranslations } from '../../i18n/utils';

const t = useTranslations('de');
---

<Base title="Willkommen" description={t('hero.subline')}>
  <Hero
    headline={t('hero.headline')}
    subline={t('hero.subline')}
    ctaLabel={t('hero.cta')}
    ctaHref={t('hero.cta.href')}
  />
  <SafeSpaceStatement statement={t('safespace.statement')} />
  <CourseTeaser
    lang="de"
    title={t('courses.title')}
    ctaLabel={t('courses.cta')}
    ctaHref={t('courses.cta.href')}
  />
  <BlogTeaser
    lang="de"
    title={t('blog.title')}
    ctaLabel={t('blog.cta')}
    ctaHref={t('blog.cta.href')}
  />
</Base>
```

- [ ] **Schritt 3: src/pages/en/index.astro erstellen**

```astro
---
import Base from '../../layouts/Base.astro';
import Hero from '../../components/sections/Hero.astro';
import SafeSpaceStatement from '../../components/sections/SafeSpaceStatement.astro';
import CourseTeaser from '../../components/sections/CourseTeaser.astro';
import BlogTeaser from '../../components/sections/BlogTeaser.astro';
import { useTranslations } from '../../i18n/utils';

const t = useTranslations('en');
---

<Base title="Welcome" description={t('hero.subline')}>
  <Hero
    headline={t('hero.headline')}
    subline={t('hero.subline')}
    ctaLabel={t('hero.cta')}
    ctaHref={t('hero.cta.href')}
  />
  <SafeSpaceStatement statement={t('safespace.statement')} />
  <CourseTeaser
    lang="en"
    title={t('courses.title')}
    ctaLabel={t('courses.cta')}
    ctaHref={t('courses.cta.href')}
  />
  <BlogTeaser
    lang="en"
    title={t('blog.title')}
    ctaLabel={t('blog.cta')}
    ctaHref={t('blog.cta.href')}
  />
</Base>
```

- [ ] **Schritt 4: TypeScript & Build prüfen**

```bash
npx astro check && npx astro build
```

Expected:
```
✓ Checking files...
...
✓ Built in Xs
```

- [ ] **Schritt 5: Dev-Server starten und visuell prüfen**

```bash
npm run dev
```

Öffne `http://localhost:4321` — should redirect to `/de/`. Prüfe:
- Hero mit Headline und CTA sichtbar
- Safe Space Statement mit Lime-Unterstrich
- Kurs-Teaser mit Karte
- Blog-Teaser mit einem Beitrag
- Dark Mode Toggle funktioniert mit Breath-Animation
- Header scrollt transparent → weißer Hintergrund
- Mobile Hamburger-Menü öffnet Sheet
- `/en/` zeigt englische Inhalte

- [ ] **Schritt 6: Final Commit**

```bash
git add src/pages/
git commit -m "feat: homepage pages DE/EN with all sections and redirect"
```
