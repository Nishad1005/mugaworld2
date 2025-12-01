import Link from 'next/link';
import { Instagram, Twitter, Linkedin, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="relative bg-[#F8EDD3] dark:bg-[#1D1D1D] border-t border-[#E6E6E6] dark:border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20">
          <div className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-7xl md:text-8xl font-light text-[#1D1D1D] dark:text-[#FFFEF2] leading-none break-all">
                hello@mugaworld.studio
              </h3>
              <p className="text-xl text-[#1D1D1D]/70 dark:text-[#FFFEF2]/70 font-light italic">
                Assam | Worldwide
              </p>
            </div>

            <Link href="/contact">
              <Button
                size="lg"
                className="group relative bg-transparent hover:bg-[#D9B77C] border-2 border-[#D9B77C] text-[#1D1D1D] dark:text-[#FFFEF2] hover:text-[#1D1D1D] font-medium px-10 py-7 text-lg rounded-full cinematic-transition overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Start a Project
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 cinematic-transition" />
                </span>
                <span className="absolute inset-0 bg-[#D9B77C] scale-x-0 group-hover:scale-x-100 cinematic-transition origin-left"></span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-sm font-bold text-[#D9B77C] uppercase tracking-wider mb-6">
                Navigate
              </h4>
              <ul className="space-y-4">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/about', label: 'Studio' },
                  { href: '/services', label: 'Services' },
                  { href: '/shop', label: 'Work' },
                  { href: '/contact', label: 'Contact' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-base text-[#1D1D1D] dark:text-[#FFFEF2] hover:text-[#D9B77C] dark:hover:text-[#D9B77C] cinematic-transition"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D9B77C] group-hover:w-full cinematic-transition"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-[#D9B77C] uppercase tracking-wider mb-6">
                Connect
              </h4>
              <div className="flex flex-col gap-4">
                {[
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Twitter, label: 'Twitter', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: '#' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="group inline-flex items-center gap-3 text-base text-[#1D1D1D] dark:text-[#FFFEF2] hover:text-[#D9B77C] dark:hover:text-[#D9B77C] cinematic-transition"
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="relative">
                      {social.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D9B77C] group-hover:w-full cinematic-transition"></span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-[#E6E6E6] dark:border-[#2A2A2A]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/PNG copy copy.png" alt="MUGA WORLD" className="w-12 h-12 object-contain opacity-80" />
              <div>
                <div className="text-lg font-bold text-[#1D1D1D] dark:text-[#FFFEF2]">
                  MUGA WORLD
                </div>
                <p className="text-sm text-[#1D1D1D]/60 dark:text-[#FFFEF2]/60 italic">
                  Culture-led Design Studio
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#1D1D1D]/60 dark:text-[#FFFEF2]/60">
              <MapPin className="w-4 h-4" />
              <span>Assam, India</span>
            </div>

            <p className="text-sm text-[#1D1D1D]/60 dark:text-[#FFFEF2]/60">
              &copy; {new Date().getFullYear()} MUGA WORLD. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
