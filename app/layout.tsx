import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LuckyLens - Your Fun Lottery Companion',
  description: 'Generate lucky lottery numbers with style. Random, trend-based, or pick your own. For entertainment purposes only.',
  keywords: ['lottery', 'numbers', 'random', 'generator', 'powerball', 'mega millions', 'entertainment'],
  authors: [{ name: 'LuckyLens' }],
  creator: 'LuckyLens',
  publisher: 'LuckyLens',
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luckylens.app',
    siteName: 'LuckyLens',
    title: 'LuckyLens - Your Fun Lottery Companion',
    description: 'Generate lucky lottery numbers with style. For entertainment purposes only.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LuckyLens - Lottery Number Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuckyLens - Your Fun Lottery Companion',
    description: 'Generate lucky lottery numbers with style. For entertainment purposes only.',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#6366F1' },
    { media: '(prefers-color-scheme: dark)', color: '#1F2937' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
