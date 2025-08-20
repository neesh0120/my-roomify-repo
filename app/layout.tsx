import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from './providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Roomify - AI-Powered AR Interior Design',
  description: 'Transform your space with AI-powered interior design and AR visualization. Upload a photo, select styles, and see your dream room come to life.',
  keywords: 'interior design, AI, AR, room design, home decor, furniture visualization',
  authors: [{ name: 'Roomify Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8B5CF6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏠</text></svg>" />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}