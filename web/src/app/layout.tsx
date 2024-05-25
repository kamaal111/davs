import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Theme from '@/theme/theme-provider';
import IntlProvider from '@/translations/intl-provider';

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
        <Theme>
          <IntlProvider>
            {children}
            <Toaster />
          </IntlProvider>
        </Theme>
      </body>
    </html>
  );
}

export default RootLayout;
