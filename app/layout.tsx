import './globals.css';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';               // ✅ default import
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';

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
  // Helps Next.js resolve OG/Twitter images during build (avoids warnings)
  metadataBase: new URL('https://mugaworld2.netlify.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
  );
}
