import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
        </nav>

        {/* Mobile navigation */}
        <div className="flex md:hidden items-center gap-2">
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
