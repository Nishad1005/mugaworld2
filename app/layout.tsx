import './globals.css'
import type { Metadata } from 'next'

// ⬇ Your components
import Navbar from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ThemeProvider'

// ⬇ ADD THIS (Mascot Assistant import)
import MugaMascotAssistant from '@/components/MugaMascotAssistant'

// ──────────────────────────── SEO SETTINGS ───────────────────────────── //

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://mugaworld2.netlify.app'

export const metadata: Metadata = {
  title: 'MUGA WORLD - Handmade from Assam, Digital Solutions for the World',
  description:
    'Discover authentic Assamese handmade products and premium digital services. MUGA WORLD blends heritage craftsmanship with modern digital solutions.',
  keywords:
    'Assamese handicrafts, handloom, digital marketing, website development, Assam products',
  openGraph: {
    title: 'MUGA WORLD - Handmade from Assam, Digital Solutions for the World',
    description:
      'Discover authentic Assamese handmade products and premium digital services.',
    type: 'website',
  },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
}

// ──────────────────────────── LAYOUT ───────────────────────────── //

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          
          {/* 🌍 Navigation */}
          <Navbar />

          {/* 📄 Page Content */}
          <main className="min-h-screen">{children}</main>

          {/* 🔻 Footer & Global UI */}
          <Footer />
          <WhatsAppButton />
          <Toaster />

          {/* 🦏 🟠 Floating Assistant Mascot (Appears on every page) */}
          <MugaMascotAssistant />

        </ThemeProvider>
      </body>
    </html>
  )
}
