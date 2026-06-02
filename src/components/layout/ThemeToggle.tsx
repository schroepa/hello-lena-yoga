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

    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem('theme', next);
    setTheme(next);

    document.body.classList.add('theme-breath');
    const onEnd = () => {
      document.body.classList.remove('theme-breath');
      document.body.removeEventListener('animationend', onEnd);
    };
    document.body.addEventListener('animationend', onEnd);
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
