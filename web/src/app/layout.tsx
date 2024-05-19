import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Theme from '@/providers/theme';

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
        <Theme themePanel={false}>{children}</Theme>
      </body>
    </html>
  );
}

export default RootLayout;
