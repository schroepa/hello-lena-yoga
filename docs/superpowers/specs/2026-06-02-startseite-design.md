# Design-Spec: Startseite (hello-lena-yoga)

**Datum:** 2026-06-02  
**Scope:** Startseite (`/de/` + `/en/`) als erster Live-Release

---

## Ziel & Gefühl

Die Startseite vermittelt auf den ersten Blick: *Ich bin willkommen wie ich bin. Hier ist Ruhe und Raum. Das ist professionell und authentisch zugleich.*

Keine Conversion-Optimierung, keine Barrieren-Überwindung — eine authentische Präsenz für Menschen, die mit Interesse kommen.

---

## Seitenstruktur (von oben nach unten)

1. **Header** — transparent über Hero, Logo links, Nav + Sprachwechsel + Dark-Mode-Toggle rechts. Bei Scroll: warmer weißer/dunkler Hintergrund, leichter Schatten. Mobile: Hamburger → shadcn Sheet.
2. **Hero** — 100vh, große Fraunces-Headline, kurzer Einladungssatz in Geist, ein CTA-Button mit Neon-Lime-Akzent. Kein Bild — Typografie ist das Design.
3. **Safe Space Statement** — kurze ehrliche Aussage, große Schrift, viel Leerraum. Kein Kasten, kein Block. Neon-Lime als Akzent-Element (einmal).
4. **Kurs-Teaser** — 2–3 shadcn Cards, minimalistisch. Titel, kurze Beschreibung, Link. Kein Booking hier.
5. **Blog-Teaser** — 1–2 aktuelle Beiträge. Titel + Datum, kein Thumbnail.
6. **Footer** — Links, Kontakt, Social, Impressum/Datenschutz.

---

## Visuelles System

### Typografie
- **Fraunces** (variable, Google Fonts) — Headlines, große Statements, Sektions-Titel
- **Geist** (bereits installiert via `@fontsource-variable/geist`) — Body, Navigation, Labels

### Farbpalette

```css
/* Light Mode */
--background: oklch(0.98 0.008 80);       /* warmes Off-White */
--foreground: oklch(0.15 0.01 60);        /* fast-schwarz, warm */
--primary: oklch(0.75 0.22 130);          /* Neon Lime */
--primary-foreground: oklch(0.15 0.01 60);
--muted-foreground: oklch(0.50 0.01 70);  /* warmes Hellgrau */

/* Dark Mode */
--background: oklch(0.14 0.015 60);       /* tiefes, warmes Dunkelbraun */
--foreground: oklch(0.95 0.008 80);
--primary: oklch(0.80 0.22 130);          /* Neon Lime, etwas heller im Dark */
```

### Akzent-Regel
Neon-Lime erscheint auf der Startseite genau **zweimal**:
1. CTA-Button im Hero
2. Ein einzelnes Element im Safe Space Statement (Unterstrich, Punkt o.ä.)

### Leerraum
Großzügige vertikale Abstände. Hero hat mindestens 30% Luft über dem Fold.

---

## Dark Mode

- Automatisch via `prefers-color-scheme`, zusätzlich manuell umschaltbar
- **Breath-Transition:** Beim Umschalten kurzes `scale(0.998)` + `opacity`-Dip auf der gesamten Seite — subtil, spürbar, passend zum Atemrhythmus des Yin Yoga
- CSS transitions auf `background-color`, `color` und verwandten Properties
- Toggle-Icon: kein Sonne/Mond-Klischee — ein unerwartetes, minimalistisches Icon (Kreis der sich füllt/leert, oder Fraunces-Zeichen)
- Zustand wird in `localStorage` gespeichert

---

## i18n

- Beide Sprachen von Anfang an: `/de/` (default) und `/en/`
- `/` → redirect zu `/de/`
- `src/pages/de/index.astro` und `src/pages/en/index.astro` — gleiche Komponenten, unterschiedliche Strings
- UI-Strings in `src/i18n/de.ts` und `src/i18n/en.ts`

---

## Komponenten-Architektur

| Komponente | Typ | Zweck |
|---|---|---|
| `src/layouts/Base.astro` | Layout | `<html>`, Meta, Font-Imports, dark mode class |
| `src/components/layout/Header.tsx` | React (`client:load`) | Navigation, Sprachwechsel, Dark-Mode-Toggle |
| `src/components/layout/Footer.astro` | Astro | Links, Kontakt, Legal |
| `src/components/layout/ThemeToggle.tsx` | React (in Header) | Breath-Animation, localStorage |
| `src/components/sections/Hero.astro` | Astro | Headline, Einladungssatz, CTA |
| `src/components/sections/SafeSpaceStatement.astro` | Astro | Kernaussage, Neon-Akzent |
| `src/components/sections/CourseTeaser.astro` | Astro | 2–3 Kurs-Karten |
| `src/components/sections/BlogTeaser.astro` | Astro | 1–2 Blog-Previews |

**Prinzip:** React nur wo Interaktivität nötig. Alle anderen Komponenten sind statische Astro-Komponenten. i18n-Strings fließen als Props in jede Sektion — keine Strings hart kodiert.

---

## Was noch offen ist (außerhalb dieser Spec)

- Finaler Neon-Akzent (Lime bestätigt, genaues oklch noch abstimmbar)
- Eversports Widget-ID (von Inhaberin)
- Echte Inhalte (Texte, Bilder)
- Domain
- Folgeseiten: `/ueber-mich`, `/angebote`, `/blog`, `/kontakt`
