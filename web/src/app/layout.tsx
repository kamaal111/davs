import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AppProviders from '@/providers';

import '@radix-ui/themes/styles.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Davs client',
  description: 'Davs client',
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

export default RootLayout;
