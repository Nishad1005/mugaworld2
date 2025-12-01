'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 800);

    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <button className="relative w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center">
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="relative w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden group"
      aria-label="Toggle theme"
    >
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform group-hover:rotate-12" />
        ) : (
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-transform group-hover:-rotate-12" />
        )}
      </div>

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px',
            transform: 'translate(-50%, -50%)',
            animation: 'wave-ripple 0.8s ease-out',
            background: theme === 'dark'
              ? 'radial-gradient(circle, rgba(217, 183, 124, 0.4) 0%, rgba(217, 183, 124, 0) 70%)'
              : 'radial-gradient(circle, rgba(58, 97, 74, 0.4) 0%, rgba(58, 97, 74, 0) 70%)',
          }}
        />
      ))}

      <style jsx>{`
        @keyframes wave-ripple {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
