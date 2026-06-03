# CLAUDE.md Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the entire site into full compliance with CLAUDE.md — correct color system (Magenta/Lime/Hyperblue), correct fonts (Clash Display + Instrument Serif), no manual dark mode toggle, editorial navigation, redesigned Hero, and all anti-patterns eliminated.

**Architecture:** Three-layer approach — (1) Design System foundation in global.css sets every token, (2) Infrastructure (Base.astro, astro.config) wires tokens into the page shell, (3) Components are rebuilt from scratch using only `var(--color-*)` and `var(--text-*)` tokens. No hardcoded values anywhere.

**Tech Stack:** Astro 6, Tailwind CSS v4, React 19 (islands only), local WOFF2 fonts, CSS custom properties, prefers-color-scheme media query

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/styles/global.css` | Rewrite | LENA tokens, fonts, typescale, spacing, animation, shadcn overrides |
| `src/layouts/Base.astro` | Modify | Font preloads, remove dark init script, remove ThemeToggle props |
| `src/components/layout/ThemeToggle.tsx` | Delete | No manual toggle per CLAUDE.md |
| `src/components/layout/Header.tsx` | Rewrite | Editorial nav, no hamburger, fullscreen mobile overlay |
| `src/components/sections/Hero.astro` | Rewrite | Not the standard hero pattern, CAPS, vertical label, geometry |
| `src/components/sections/SafeSpaceStatement.astro` | Modify | Use new CSS vars |
| `src/components/sections/CourseTeaser.astro` | Modify | Not symmetric grid, new card style |
| `src/components/sections/BlogTeaser.astro` | Modify | Use new CSS vars, remove divide-y separator |
| `src/components/layout/Footer.astro` | Modify | Remove border-t separator, editorial style |
| `src/i18n/de.ts` | Modify | Headlines CAPS, add hero.label, add nav.mobile keys |
| `src/i18n/en.ts` | Modify | Headlines CAPS, matching keys |
| `astro.config.mjs` | Modify | Add Vercel adapter, output: hybrid |
| `vercel.json` | Create | Vercel deployment config |

---

## Task 1: Design System — global.css komplett neu

**Files:**
- Modify: `src/styles/global.css`

This is the foundation. All other tasks depend on it. Do not skip steps.

- [ ] **Schritt 1: global.css komplett ersetzen**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* ─────────────────────────────────────────────────────────
   FONTS — lokal aus /public/fonts/
───────────────────────────────────────────────────────── */

@font-face {
  font-family: 'Clash Display';
  src: url('/fonts/ClashDisplay-Variable.woff2') format('woff2');
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
  size-adjust: 100%;
}

@font-face {
  font-family: 'Instrument Serif';
  src: url('/fonts/InstrumentSerif-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  size-adjust: 100%;
}

@font-face {
  font-family: 'Instrument Serif';
  src: url('/fonts/InstrumentSerif-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
  size-adjust: 100%;
}

/* ─────────────────────────────────────────────────────────
   LENA DESIGN TOKENS — Dark Mode Standard
───────────────────────────────────────────────────────── */

:root {
  --color-bg:        #080808;
  --color-surface:   #111111;
  --color-primary:   #FF2D78;
  --color-secondary: #C8FF00;
  --color-accent:    #0047FF;
  --color-text:      #F0EDE8;
  --color-muted:     #444444;
  --color-border:    #222222;
}

@media (prefers-color-scheme: light) {
  :root {
    --color-bg:        #F5F0EB;
    --color-surface:   #FFFFFF;
    --color-primary:   #E8003D;
    --color-secondary: #7AAF00;
    --color-accent:    #0030CC;
    --color-text:      #0A0A0A;
    --color-muted:     #888888;
    --color-border:    #E0DBD5;
  }
}

/* ─────────────────────────────────────────────────────────
   SHADCN OVERRIDES — map shadcn vars → LENA tokens
───────────────────────────────────────────────────────── */

:root {
  --background: var(--color-bg);
  --foreground: var(--color-text);
  --card: var(--color-surface);
  --card-foreground: var(--color-text);
  --popover: var(--color-surface);
  --popover-foreground: var(--color-text);
  --primary: var(--color-primary);
  --primary-foreground: var(--color-bg);
  --secondary: var(--color-secondary);
  --secondary-foreground: var(--color-bg);
  --muted: var(--color-surface);
  --muted-foreground: var(--color-muted);
  --accent: var(--color-accent);
  --accent-foreground: var(--color-bg);
  --destructive: #FF4444;
  --border: var(--color-border);
  --input: var(--color-border);
  --ring: var(--color-primary);
  --radius: 0;                 /* CLAUDE.md: border-radius: 0 everywhere */
  --sidebar: var(--color-surface);
  --sidebar-foreground: var(--color-text);
  --sidebar-primary: var(--color-primary);
  --sidebar-primary-foreground: var(--color-bg);
  --sidebar-accent: var(--color-surface);
  --sidebar-accent-foreground: var(--color-text);
  --sidebar-border: var(--color-border);
  --sidebar-ring: var(--color-primary);
}

/* ─────────────────────────────────────────────────────────
   TAILWIND v4 THEME — utility classes from LENA tokens
───────────────────────────────────────────────────────── */

@theme inline {
  /* Fonts */
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'Instrument Serif', serif;
  /* bg, surface, primary, secondary, accent, copy, muted, border */
  --color-bg:        var(--color-bg);
  --color-surface:   var(--color-surface);
  --color-primary:   var(--color-primary);
  --color-secondary: var(--color-secondary);
  --color-accent:    var(--color-accent);
  --color-copy:      var(--color-text);
  --color-muted:     var(--color-muted);
  --color-border:    var(--color-border);
}

/* ─────────────────────────────────────────────────────────
   FLUID TYPESCALE
───────────────────────────────────────────────────────── */

:root {
  --text-display:  clamp(3.5rem, 12vw, 14rem);
  --text-headline: clamp(2.5rem, 7vw, 8rem);
  --text-sub:      clamp(1.5rem, 4vw, 4rem);
  --text-body:     clamp(1rem, 1.5vw, 1.25rem);
  --text-caption:  clamp(0.75rem, 1vw, 0.875rem);
  --text-sidebar:  clamp(0.625rem, 0.8vw, 0.75rem);
}

/* ─────────────────────────────────────────────────────────
   SPACING — rhythmisch wechselnd
───────────────────────────────────────────────────────── */

:root {
  --space-tight: clamp(2rem, 5vw, 4rem);
  --space-wide:  clamp(5rem, 12vw, 12rem);
  --space-xs:    clamp(0.5rem, 1vw, 0.75rem);
  --space-sm:    clamp(0.75rem, 1.5vw, 1rem);
  --space-md:    clamp(1rem, 2.5vw, 1.5rem);
  --space-lg:    clamp(1.5rem, 4vw, 3rem);
  --space-xl:    clamp(2.5rem, 6vw, 5rem);
}

/* ─────────────────────────────────────────────────────────
   EASING & ANIMATION
───────────────────────────────────────────────────────── */

:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ─────────────────────────────────────────────────────────
   BASE LAYER
───────────────────────────────────────────────────────── */

@layer base {
  * {
    box-sizing: border-box;
  }
  html {
    background-color: var(--color-bg);
    color: var(--color-text);
    font-family: 'Instrument Serif', serif;
    font-size: var(--text-body);
    scroll-behavior: smooth;
  }
  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    min-height: 100dvh;
    overflow-x: hidden;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Clash Display', sans-serif;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }
}

/* ─────────────────────────────────────────────────────────
   TEXT MASKING — Signature-Element
───────────────────────────────────────────────────────── */

.text-mask {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-reveal {
  clip-path: inset(0 100% 0 0);
  animation: reveal 1000ms var(--ease-out-expo) forwards;
}

@keyframes reveal {
  to { clip-path: inset(0 0% 0 0); }
}

/* ─────────────────────────────────────────────────────────
   REVEAL ANIMATIONS
───────────────────────────────────────────────────────── */

.reveal {
  opacity: 0;
  scale: 0.98;
  transition: opacity 800ms var(--ease-out-expo),
              scale 800ms var(--ease-out-expo);
}

.reveal.visible {
  opacity: 1;
  scale: 1;
}

.reveal-group > * {
  opacity: 0;
  transition: opacity 600ms var(--ease-out-expo);
}
.reveal-group > *:nth-child(1) { transition-delay: 0ms; }
.reveal-group > *:nth-child(2) { transition-delay: 80ms; }
.reveal-group > *:nth-child(3) { transition-delay: 160ms; }
.reveal-group > *:nth-child(4) { transition-delay: 240ms; }

/* ─────────────────────────────────────────────────────────
   BUTTONS
───────────────────────────────────────────────────────── */

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background: var(--color-primary);
  color: var(--color-bg);
  border-radius: 0;
  padding: var(--space-sm) var(--space-lg);
  font-family: 'Clash Display', sans-serif;
  font-weight: 600;
  font-size: var(--text-caption);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 300ms var(--ease-out-expo);
  cursor: pointer;
  border: none;
}

.btn-primary:hover {
  box-shadow: 0 0 24px var(--color-primary),
              0 0 48px color-mix(in srgb, var(--color-primary) 40%, transparent);
}

@media (prefers-color-scheme: light) {
  .btn-primary:hover {
    box-shadow: 4px 4px 0px var(--color-text);
  }
}

.btn-primary:active {
  scale: 0.97;
  opacity: 0.85;
  transition-duration: 100ms;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background: transparent;
  border: 1.5px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: 0;
  padding: var(--space-sm) var(--space-lg);
  font-family: 'Clash Display', sans-serif;
  font-weight: 600;
  font-size: var(--text-caption);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 300ms var(--ease-out-expo);
  cursor: pointer;
}

.btn-outline:hover {
  background: var(--color-primary);
  color: var(--color-bg);
  border-radius: 9999px;
}

/* ─────────────────────────────────────────────────────────
   SHADCN COMPONENT OVERRIDES
───────────────────────────────────────────────────────── */

/* Inputs: nur border-bottom */
input, textarea, [cmdk-input] {
  border: none !important;
  border-bottom: 1.5px solid var(--color-border) !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--color-text) !important;
  transition: border-color 200ms var(--ease-out-expo);
}
input:focus, textarea:focus {
  border-bottom-color: var(--color-primary) !important;
  box-shadow: 0 2px 0 var(--color-primary) !important;
  outline: none !important;
}

/* Cards: sharp, LENA colors */
[data-slot="card"] {
  background: var(--color-surface) !important;
  border: 1px solid var(--color-border) !important;
  border-radius: 0 !important;
}

/* Buttons: no default rounding */
button[data-slot="button"] {
  border-radius: 0 !important;
}

/* Sheet / Dialog overlay */
[data-slot="sheet-overlay"],
[data-slot="dialog-overlay"] {
  background: rgba(0, 0, 0, 0.92) !important;
  backdrop-filter: blur(8px) !important;
}

/* ─────────────────────────────────────────────────────────
   NOISE TEXTURE UTILITY
───────────────────────────────────────────────────────── */

.noise {
  position: relative;
}
.noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1;
}

/* ─────────────────────────────────────────────────────────
   PREFERS-REDUCED-MOTION — immer
───────────────────────────────────────────────────────── */

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Schritt 2: Build prüfen**

```bash
cd /Users/ptrck/Documents/yoga-website
npx astro build 2>&1 | tail -5
```

Expected: `[build] Complete!` — ggf. Tailwind v4 circular-var warnings beachten, aber Build muss durchgehen.

- [ ] **Schritt 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: CLAUDE.md compliant design system — LENA tokens, Clash Display, fluid scale"
```

---

## Task 2: Base.astro — Font-Preloads, kein ThemeToggle

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Schritt 1: Base.astro komplett ersetzen**

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
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="generator" content={Astro.generator} />
    <title>{title} · Lena Yoga</title>
    <meta name="description" content={description} />

    <!-- Font preloads — kritisch für LCP / CLS -->
    <link rel="preload" href="/fonts/ClashDisplay-Variable.woff2"
          as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/InstrumentSerif-Regular.woff2"
          as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/InstrumentSerif-Italic.woff2"
          as="font" type="font/woff2" crossorigin />
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
npx astro check 2>&1 | grep -E "error|warning" | head -10
```

Expected: Keine neuen Fehler (Header.tsx wird in Task 4 geändert).

- [ ] **Schritt 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: font preloads, remove dark mode toggle from Base layout"
```

---

## Task 3: ThemeToggle entfernen + Header-Props bereinigen

**Files:**
- Delete: `src/components/layout/ThemeToggle.tsx`
- Modify: `src/components/layout/Header.tsx` (ThemeToggle-Import entfernen, Props bleiben)

- [ ] **Schritt 1: ThemeToggle löschen**

```bash
rm /Users/ptrck/Documents/yoga-website/src/components/layout/ThemeToggle.tsx
```

- [ ] **Schritt 2: ThemeToggle aus Header.tsx entfernen**

Aus `src/components/layout/Header.tsx` diese zwei Zeilen löschen:
```tsx
import { ThemeToggle } from './ThemeToggle';
```
Und alle `<ThemeToggle />` Vorkommen im JSX entfernen (2 Stellen: desktop nav und mobile nav).

Der Rest der Header-Datei bleibt vorerst unverändert — Task 4 baut ihn komplett neu.

- [ ] **Schritt 3: Verify**

```bash
npx astro check 2>&1 | grep "error" | head -5
```

Expected: 0 Fehler.

- [ ] **Schritt 4: Commit**

```bash
git add src/components/layout/Header.tsx
git rm src/components/layout/ThemeToggle.tsx
git commit -m "feat: remove ThemeToggle — dark mode via prefers-color-scheme only"
```

---

## Task 4: Header — editorial, kein Hamburger, Mobile Fullscreen-Overlay

**Files:**
- Rewrite: `src/components/layout/Header.tsx`

CLAUDE.md §06:
- Logo: "LENA" uppercase, sehr groß oder sehr klein — nie mittelgroß
- Nav-Links: uppercase, `font-weight: 200`, `letter-spacing: 0.2em`
- Aktiver Link: Neon-Underline
- Kein Hamburger → Text "MENU" / "CLOSE"
- Mobile: Fullscreen-Overlay mit clip-path-Reveal von oben
- Keine klassische Hamburger-Ikonographie

- [ ] **Schritt 1: Header.tsx komplett ersetzen**

```tsx
import { useState } from 'react';

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'transparent',
          backdropFilter: open ? 'none' : 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: '88rem',
            margin: '0 auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo — sehr groß auf Desktop, sehr klein auf Mobile */}
          <a
            href={`/${currentLang}/`}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--color-text)',
              textDecoration: 'none',
              transition: 'color 200ms var(--ease-out-expo)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
          >
            LENA
          </a>

          {/* Desktop navigation */}
          <nav
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: '2.5rem' }}
            aria-label="Hauptnavigation"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 200,
                  fontSize: 'var(--text-caption)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                  transition: 'color 200ms var(--ease-out-expo)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--color-text)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--color-muted)';
                }}
              >
                {item.label}
              </a>
            ))}

            <a
              href={otherLangHref}
              aria-label={otherLangAriaLabel}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 200,
                fontSize: 'var(--text-caption)',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                color: 'var(--color-muted)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1px',
                transition: 'color 200ms var(--ease-out-expo)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--color-primary)';
                e.currentTarget.style.borderBottomColor = 'var(--color-primary)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--color-muted)';
                e.currentTarget.style.borderBottomColor = 'var(--color-border)';
              }}
            >
              {otherLangLabel}
            </a>
          </nav>

          {/* Mobile trigger — text statt Hamburger-Icon */}
          <button
            className="flex md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open
              ? (currentLang === 'de' ? 'Menü schließen' : 'Close menu')
              : (currentLang === 'de' ? 'Menü öffnen' : 'Open menu')
            }
            aria-expanded={open}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 200,
              fontSize: 'var(--text-caption)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: open ? 'var(--color-primary)' : 'var(--color-text)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              transition: 'color 200ms var(--ease-out-expo)',
            }}
          >
            {open ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen-Overlay — clip-path-Reveal von oben */}
      <div
        aria-hidden={!open}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
          transition: 'clip-path 0.5s var(--ease-out-expo)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <nav
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          aria-label="Mobile Navigation"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "'Clash Display', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
                textDecoration: 'none',
                lineHeight: 1,
                transition: 'color 200ms var(--ease-out-expo)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text)')}
            >
              {item.label}
            </a>
          ))}
          <a
            href={otherLangHref}
            aria-label={otherLangAriaLabel}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 200,
              fontSize: 'var(--text-caption)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-muted)',
              textDecoration: 'none',
              marginTop: '2rem',
            }}
          >
            {otherLangLabel}
          </a>
        </nav>
      </div>
    </>
  );
}
```

- [ ] **Schritt 2: Verify**

```bash
cd /Users/ptrck/Documents/yoga-website && npx astro check 2>&1 | grep "error" | head -5
```

Expected: 0 Fehler.

- [ ] **Schritt 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: editorial Header — LENA logo, uppercase nav weight 200, MENU/CLOSE fullscreen overlay"
```

---

## Task 5: Hero — nicht das Standard-Pattern

**Files:**
- Rewrite: `src/components/sections/Hero.astro`
- Modify: `src/i18n/de.ts`, `src/i18n/en.ts`

CLAUDE.md §05 + §11: Kein zentrierter Hero mit Headline + Subline + CTA. Stattdessen: massive CAPS-Display-Type, vertikaler Label-Text an der Seite, asymmetrisch.

- [ ] **Schritt 1: i18n DE — neue Hero-Keys**

In `src/i18n/de.ts` folgende Keys anpassen/hinzufügen:

```ts
// Ändern:
'hero.headline': 'YOGA FÜR\nALLE KÖRPER.',
'hero.label': 'Yin Yoga · Berlin',
'hero.cta': 'KURSE ENTDECKEN',
'hero.cta.href': '/de/angebote',
// hero.subline komplett entfernen
```

Die Datei sieht danach so aus (vollständig):

```ts
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
```

- [ ] **Schritt 2: i18n EN — entsprechend**

`src/i18n/en.ts` vollständig:

```ts
import type { UIKey } from './de';

export const ui: Record<UIKey, string> = {
  'nav.ueber': 'ABOUT',
  'nav.angebote': 'OFFERINGS',
  'nav.blog': 'BLOG',
  'nav.kontakt': 'CONTACT',
  'nav.lang': 'DE',
  'nav.lang.label': 'Auf Deutsch wechseln',
  'hero.headline': 'YOGA FOR\nEVERY BODY.',
  'hero.label': 'Yin Yoga · Berlin',
  'hero.cta': 'DISCOVER CLASSES',
  'hero.cta.href': '/en/offerings',
  'safespace.statement': 'You are welcome here.\nWith everything you bring.',
  'courses.title': 'CURRENT CLASSES',
  'courses.cta': 'ALL CLASSES',
  'courses.cta.href': '/en/offerings',
  'blog.title': 'FROM THE BLOG',
  'blog.cta': 'ALL POSTS',
  'blog.cta.href': '/en/blog',
  'footer.imprint': 'Imprint',
  'footer.privacy': 'Privacy',
  'footer.tagline': 'Yin Yoga · Body Positive · Safe Space',
};
```

- [ ] **Schritt 3: Hero.astro neu schreiben**

```astro
---
interface Props {
  headline: string;
  label: string;
  ctaLabel: string;
  ctaHref: string;
}

const { headline, label, ctaLabel, ctaHref } = Astro.props;
const headlineLines = headline.split('\n');
---

<section
  class="noise"
  style="
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: flex-end;
    padding: var(--space-wide) 1.5rem var(--space-lg);
    overflow: hidden;
  "
  data-theme-section
>
  <!-- Vertikaler Label-Text links -->
  <span
    aria-hidden="true"
    style="
      position: absolute;
      left: 1.5rem;
      top: 50%;
      transform: translateY(-50%) rotate(-90deg);
      transform-origin: center;
      font-family: 'Clash Display', sans-serif;
      font-weight: 200;
      font-size: var(--text-sidebar);
      text-transform: uppercase;
      letter-spacing: 0.3em;
      color: var(--color-muted);
      white-space: nowrap;
    "
  >
    {label}
  </span>

  <!-- Dekoratives Outline-Element — Magenta-Kreis -->
  <div
    aria-hidden="true"
    style="
      position: absolute;
      top: -8vw;
      right: -8vw;
      width: clamp(14rem, 40vw, 36rem);
      height: clamp(14rem, 40vw, 36rem);
      border: 1.5px solid var(--color-primary);
      border-radius: 50%;
      opacity: 0.35;
    "
  />

  <!-- Hauptinhalt -->
  <div style="width: 100%; max-width: 88rem; margin: 0 auto; padding-left: 2.5rem;">
    <h1
      style="
        font-family: 'Clash Display', sans-serif;
        font-weight: 700;
        font-size: var(--text-display);
        text-transform: uppercase;
        line-height: 0.92;
        letter-spacing: -0.03em;
        color: var(--color-text);
        margin-bottom: var(--space-lg);
      "
    >
      {headlineLines.map((line, i) => (
        <span style="display: block;">
          {i === 1
            ? <span class="text-mask">{line}</span>
            : line
          }
        </span>
      ))}
    </h1>

    <a href={ctaHref} class="btn-primary">
      {ctaLabel}
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </a>
  </div>
</section>
```

- [ ] **Schritt 4: Hero-Props in de/index.astro und en/index.astro aktualisieren**

In `src/pages/de/index.astro` den Hero-Aufruf ändern:

```astro
<Hero
  headline={t('hero.headline')}
  label={t('hero.label')}
  ctaLabel={t('hero.cta')}
  ctaHref={t('hero.cta.href')}
/>
```

In `src/pages/en/index.astro` identisch:

```astro
<Hero
  headline={t('hero.headline')}
  label={t('hero.label')}
  ctaLabel={t('hero.cta')}
  ctaHref={t('hero.cta.href')}
/>
```

- [ ] **Schritt 5: Verify + Build**

```bash
cd /Users/ptrck/Documents/yoga-website
npx astro check && npx astro build 2>&1 | tail -5
```

Expected: 0 Fehler, Build Complete.

- [ ] **Schritt 6: Commit**

```bash
git add src/components/sections/Hero.astro src/i18n/de.ts src/i18n/en.ts src/pages/de/index.astro src/pages/en/index.astro
git commit -m "feat: Hero redesign — display type, vertical label, Magenta text-mask, no standard hero pattern"
```

---

## Task 6: Sections aktualisieren — LENA vars, keine Anti-Patterns

**Files:**
- Modify: `src/components/sections/SafeSpaceStatement.astro`
- Modify: `src/components/sections/CourseTeaser.astro`
- Modify: `src/components/sections/BlogTeaser.astro`
- Modify: `src/components/layout/Footer.astro`

### SafeSpaceStatement

- [ ] **Schritt 1: SafeSpaceStatement.astro ersetzen**

```astro
---
interface Props {
  statement: string;
}

const { statement } = Astro.props;
const lines = statement.split('\n');
---

<section
  aria-label="Safe Space Statement"
  style="padding-block: var(--space-wide); padding-inline: 1.5rem;"
>
  <div style="max-width: 88rem; margin: 0 auto;">
    <p
      style="
        font-family: 'Instrument Serif', serif;
        font-size: var(--text-headline);
        line-height: 1.1;
        max-width: 20ch;
        color: var(--color-text);
      "
    >
      {lines.map((line, i) => (
        <>
          {i === lines.length - 1
            ? <span style="position: relative; display: inline;">
                {line}
                <span
                  aria-hidden="true"
                  style="
                    display: block;
                    height: 3px;
                    background: var(--color-primary);
                    margin-top: 0.2em;
                    width: 100%;
                  "
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

### CourseTeaser

- [ ] **Schritt 2: CourseTeaser.astro ersetzen**

Weg vom symmetrischen Grid → Featured (groß) + Rest (kleiner, rechts daneben, asymmetrisch).

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

const allKurse = await getCollection('kurse');
const kurse = allKurse
  .filter(k => k.data.lang === lang && k.data.active)
  .sort((a, b) => a.data.order - b.data.order)
  .slice(0, 3);

const [featured, ...rest] = kurse;
---

<section
  style="
    padding-block: var(--space-tight);
    padding-inline: 1.5rem;
    background: var(--color-surface);
  "
>
  <div style="max-width: 88rem; margin: 0 auto;">

    <!-- Header-Zeile -->
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: var(--space-md);">
      <h2
        style="
          font-family: 'Clash Display', sans-serif;
          font-size: var(--text-sub);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: var(--color-text);
        "
      >
        {title}
      </h2>
      <a
        href={ctaHref}
        style="
          font-family: 'Clash Display', sans-serif;
          font-size: var(--text-caption);
          font-weight: 200;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-muted);
          text-decoration: none;
          display: none;
        "
        class="sm:inline"
        onMouseEnter="this.style.color='var(--color-primary)'"
        onMouseLeave="this.style.color='var(--color-muted)'"
      >
        {ctaLabel} →
      </a>
    </div>

    {featured && (
      <!-- Asymmetrisches Layout: Featured groß (70%) + Rest gestapelt (30%) -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1px; background: var(--color-border);" class="md:grid-cols-[2fr_1fr]">
        <!-- Featured Kurs -->
        <a
          href={`/${lang}/angebote/${featured.id.split('/').pop()?.replace(/\.md$/, '')}`}
          style="
            display: block;
            padding: var(--space-lg);
            background: var(--color-bg);
            text-decoration: none;
            transition: background 200ms var(--ease-out-expo);
          "
          onMouseEnter="this.style.background='var(--color-surface)'"
          onMouseLeave="this.style.background='var(--color-bg)'"
        >
          <span
            style="
              display: block;
              font-family: 'Clash Display', sans-serif;
              font-size: var(--text-caption);
              font-weight: 200;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              color: var(--color-primary);
              margin-bottom: var(--space-sm);
            "
          >
            {featured.data.duration} MIN
          </span>
          <h3
            style="
              font-family: 'Clash Display', sans-serif;
              font-size: var(--text-sub);
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: -0.02em;
              color: var(--color-text);
              margin-bottom: var(--space-xs);
            "
          >
            {featured.data.title}
          </h3>
          <p
            style="
              font-family: 'Instrument Serif', serif;
              font-size: var(--text-body);
              color: var(--color-muted);
              max-width: 45ch;
            "
          >
            {featured.data.description}
          </p>
        </a>

        <!-- Rest der Kurse -->
        <div style="display: flex; flex-direction: column; gap: 1px; background: var(--color-border);">
          {rest.map(kurs => (
            <a
              href={`/${lang}/angebote/${kurs.id.split('/').pop()?.replace(/\.md$/, '')}`}
              style="
                display: block;
                padding: var(--space-md);
                background: var(--color-bg);
                text-decoration: none;
                flex: 1;
                transition: background 200ms var(--ease-out-expo);
              "
              onMouseEnter="this.style.background='var(--color-surface)'"
              onMouseLeave="this.style.background='var(--color-bg)'"
            >
              <h3
                style="
                  font-family: 'Clash Display', sans-serif;
                  font-size: var(--text-caption);
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  color: var(--color-text);
                  margin-bottom: 0.25rem;
                "
              >
                {kurs.data.title}
              </h3>
              <p
                style="
                  font-family: 'Instrument Serif', serif;
                  font-size: var(--text-caption);
                  color: var(--color-muted);
                "
              >
                {kurs.data.shortDescription}
              </p>
            </a>
          ))}
        </div>
      </div>
    )}

    <!-- Mobile CTA -->
    <div style="margin-top: var(--space-md);" class="sm:hidden">
      <a href={ctaHref} class="btn-outline">{ctaLabel}</a>
    </div>
  </div>
</section>
```

### BlogTeaser

- [ ] **Schritt 3: BlogTeaser.astro ersetzen**

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

<section style="padding-block: var(--space-wide); padding-inline: 1.5rem;">
  <div style="max-width: 88rem; margin: 0 auto;">

    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: var(--space-md);">
      <h2
        style="
          font-family: 'Clash Display', sans-serif;
          font-size: var(--text-sub);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: var(--color-text);
        "
      >
        {title}
      </h2>
      <a
        href={ctaHref}
        style="
          font-family: 'Clash Display', sans-serif;
          font-size: var(--text-caption);
          font-weight: 200;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-muted);
          text-decoration: none;
        "
        class="hidden sm:inline"
      >
        {ctaLabel} →
      </a>
    </div>

    <div>
      {posts.map((post) => (
        <article style="padding-block: var(--space-md);">
          <a
            href={`/${lang}/blog/${post.id.split('/').pop()?.replace(/\.md$/, '')}`}
            style="
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 2rem;
              text-decoration: none;
              color: inherit;
            "
          >
            <div>
              <h3
                style="
                  font-family: 'Clash Display', sans-serif;
                  font-size: var(--text-caption);
                  font-weight: 600;
                  text-transform: uppercase;
                  letter-spacing: 0.05em;
                  color: var(--color-text);
                  margin-bottom: 0.5rem;
                  transition: color 200ms var(--ease-out-expo);
                "
                class="group-hover:text-primary"
              >
                {post.data.title}
              </h3>
              <p
                style="
                  font-family: 'Instrument Serif', serif;
                  font-size: var(--text-body);
                  color: var(--color-muted);
                  max-width: 55ch;
                "
              >
                {post.data.description}
              </p>
            </div>
            <time
              datetime={post.data.pubDate.toISOString()}
              style="
                font-family: 'Clash Display', sans-serif;
                font-size: var(--text-sidebar);
                font-weight: 200;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                color: var(--color-muted);
                white-space: nowrap;
                padding-top: 0.2rem;
                flex-shrink: 0;
              "
            >
              {dateFormatter.format(post.data.pubDate)}
            </time>
          </a>
        </article>
      ))}
    </div>

    <div style="margin-top: var(--space-md);" class="sm:hidden">
      <a href={ctaHref} class="btn-outline">{ctaLabel}</a>
    </div>
  </div>
</section>
```

### Footer

- [ ] **Schritt 4: Footer.astro ersetzen**

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

<footer style="margin-top: var(--space-wide); padding-block: var(--space-md); padding-inline: 1.5rem;">
  <div
    style="
      max-width: 88rem;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    "
    class="sm:flex-row sm:items-center sm:justify-between"
  >
    <p
      style="
        font-family: 'Clash Display', sans-serif;
        font-weight: 700;
        font-size: var(--text-caption);
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--color-text);
      "
    >
      LENA
    </p>

    <p
      style="
        font-family: 'Clash Display', sans-serif;
        font-weight: 200;
        font-size: var(--text-caption);
        text-transform: uppercase;
        letter-spacing: 0.15em;
        color: var(--color-muted);
      "
    >
      {tagline}
    </p>

    <nav
      style="display: flex; align-items: center; gap: 2rem;"
      aria-label="Footer Navigation"
    >
      <a
        href={`/${lang}/impressum`}
        style="
          font-family: 'Clash Display', sans-serif;
          font-weight: 200;
          font-size: var(--text-caption);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 200ms var(--ease-out-expo);
        "
        onMouseEnter="this.style.color='var(--color-text)'"
        onMouseLeave="this.style.color='var(--color-muted)'"
      >
        {imprintLabel}
      </a>
      <a
        href={`/${lang}/datenschutz`}
        style="
          font-family: 'Clash Display', sans-serif;
          font-weight: 200;
          font-size: var(--text-caption);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--color-muted);
          text-decoration: none;
          transition: color 200ms var(--ease-out-expo);
        "
        onMouseEnter="this.style.color='var(--color-text)'"
        onMouseLeave="this.style.color='var(--color-muted)'"
      >
        {privacyLabel}
      </a>
    </nav>
  </div>
</footer>
```

- [ ] **Schritt 5: Build prüfen**

```bash
cd /Users/ptrck/Documents/yoga-website
npx astro check && npx astro build 2>&1 | tail -5
```

Expected: 0 Fehler, Build Complete.

- [ ] **Schritt 6: Commit**

```bash
git add src/components/sections/SafeSpaceStatement.astro \
        src/components/sections/CourseTeaser.astro \
        src/components/sections/BlogTeaser.astro \
        src/components/layout/Footer.astro
git commit -m "feat: sections + footer rebuilt with LENA design system — no anti-patterns"
```

---

## Task 7: Vercel Infrastructure

**Files:**
- Modify: `astro.config.mjs`
- Create: `vercel.json`

- [ ] **Schritt 1: @astrojs/vercel installieren**

```bash
cd /Users/ptrck/Documents/yoga-website
npm install @astrojs/vercel
```

- [ ] **Schritt 2: astro.config.mjs aktualisieren**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
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

- [ ] **Schritt 3: vercel.json erstellen**

```json
{
  "buildCommand": "astro build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "astro"
}
```

- [ ] **Schritt 4: Build prüfen**

```bash
cd /Users/ptrck/Documents/yoga-website
npx astro build 2>&1 | tail -5
```

Expected: Build Complete.

- [ ] **Schritt 5: Commit + Push**

```bash
git add astro.config.mjs vercel.json package.json package-lock.json
git commit -m "feat: Vercel adapter, output hybrid, vercel.json"
git push origin main
```

---

## Self-Review

**Spec Coverage Check:**

| CLAUDE.md Anforderung | Task |
|---|---|
| `--color-bg` etc. CSS vars + prefers-color-scheme | Task 1 |
| Clash Display Variable + Instrument Serif | Task 1 + Task 2 |
| Font preload in `<head>` | Task 2 |
| Kein manueller Dark Mode Toggle | Task 3 |
| Nav: uppercase, weight 200, letter-spacing 0.2em | Task 4 |
| Nav: kein Hamburger | Task 4 |
| Mobile: Fullscreen-Overlay, clip-path-Reveal | Task 4 |
| Fluid Typescale `--text-display` etc. | Task 1 |
| Spacing `--space-tight/wide` etc. | Task 1 |
| `--ease-out-expo` | Task 1 |
| `prefers-reduced-motion` | Task 1 |
| `.text-mask` | Task 1 |
| Reveal-Animationen | Task 1 |
| `.btn-primary` border-radius: 0, Neon-Glow | Task 1 |
| CAPS Headlines | Task 5 |
| Kein Standard-Hero-Pattern | Task 5 |
| Vertikaler Text am Rand | Task 5 |
| Kein symmetrisches Card-Grid | Task 6 |
| Kein `border-bottom` als Sektions-Trenner im Footer | Task 6 |
| shadcn-Overrides (radius 0, LENA colors) | Task 1 |
| `output: hybrid`, Vercel-Adapter | Task 7 |
| `vercel.json` | Task 7 |

**Kein Placeholder gefunden.** Alle Tasks haben vollständigen Code.

**Type Consistency:** `UIKey` aus de.ts wird in en.ts und utils.ts verwendet — konsistent. `hero.subline` wurde entfernt und durch `hero.label` ersetzt — beide i18n-Dateien werden in Task 5 gleichzeitig aktualisiert.
