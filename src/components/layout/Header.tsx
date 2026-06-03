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
          zIndex: 60,
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
