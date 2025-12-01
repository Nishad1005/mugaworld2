'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Studio' },
  { href: '/services', label: 'Services' },
  { href: '/shop', label: 'Work' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E6E6E6]/50 dark:border-[#2A2A2A]/50 bg-white/90 dark:bg-[#1D1D1D]/90 backdrop-blur-lg">
      <nav className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group" onClick={close}>
            <img
              src="/PNG copy copy.png"
              alt="MUGA WORLD"
              className="w-10 h-10 object-contain cinematic-transition group-hover:scale-110"
            />
            <span className="text-xl font-semibold tracking-tight text-[#1D1D1D] dark:text-[#FFFEF2]">
              MUGA WORLD
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-4 py-2 text-sm font-medium transition-colors"
              >
                <span className={`relative ${active ? 'text-[#D9B77C]' : 'text-[#1D1D1D] dark:text-[#FFFEF2] hover:text-[#D9B77C] dark:hover:text-[#D9B77C]'} cinematic-transition`}>
                  {link.label}
                </span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#D9B77C] cinematic-transition ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden border-t border-[#E6E6E6]/50 dark:border-[#2A2A2A]/50 transition-all duration-300 ease-out ${open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 py-4 space-y-2 bg-white/95 dark:bg-[#1D1D1D]/95 backdrop-blur-lg">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${active ? 'bg-[#D9B77C]/10 text-[#D9B77C]' : 'text-[#1D1D1D] dark:text-[#FFFEF2] hover:bg-[#F8EDD3]/20 dark:hover:bg-[#D9B77C]/10'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
