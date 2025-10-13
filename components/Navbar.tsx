'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';

// Load user menu on the client only (it reads Supabase session on the client)
const UserMenu = dynamic(() => import('@/components/auth/UserMenu'), { ssr: false });

/**
 * Simple site links. Add/remove to match your routes.
 * If a route doesn't exist in your app, you can safely delete it here.
 */
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/70 dark:border-gray-800/80 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-gray-950/60">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
         <Link href="/" className="flex items-center gap-2" onClick={close}>
  <Image
    src="/PNG copy copy.png"   // ← your file inside /public
    alt="MUGA WORLD"
    width={32}
    height={32}
    className="rounded-lg"
    priority
  />
  <span className="text-lg font-bold tracking-tight">MugaWorld</span>
</Link>
        </div>

        {/* Center: Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  'px-3 py-2 rounded-md text-sm transition',
                  active
                    ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/60',
                ].join(' ')}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right: Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <UserMenu />
          <ThemeToggle />
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={[
          'md:hidden overflow-hidden border-t border-gray-200/70 dark:border-gray-800/80 transition-[max-height,opacity] duration-300 ease-out',
          open ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="px-4 py-3 space-y-1 bg-white/90 dark:bg-gray-950/90 backdrop-blur">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className={[
                  'block px-3 py-2 rounded-md text-sm transition',
                  active
                    ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-100 dark:bg-gray-800'
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900/60',
                ].join(' ')}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Mobile user menu */}
          <div className="pt-2">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

