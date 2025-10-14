import './globals.css'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'               // ✅ default import
import { Footer } from '@/components/Footer'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/ThemeProvider'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://mugaworld2.netlify.app' // fallback for local/preview

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
    // You can add images here later if you have an OG image URL
    // images: [{ url: '/og.jpg' }],
  },
  // ✅ Use env-based absolute origin so Next can resolve OG/Twitter URLs at build
  metadataBase: new URL(siteUrl),
  // Optional but nice: set a canonical to the homepage by default
  alternates: { canonical: '/' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
