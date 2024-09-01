import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

import Theme from '@/theme/theme-provider';
import IntlProvider from '@/translations/intl-provider';
import StoreProvider from '@/store/store-provider';

import '@radix-ui/themes/styles.css';
import '@/styles/globals.sass';

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
  const requestHeaders = headers();
  const sessionHeader = requestHeaders.get('session');
  const session: { username: string } | null = sessionHeader
    ? JSON.parse(sessionHeader)
    : null;

  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider session={session}>
          <Theme>
            <IntlProvider>{children}</IntlProvider>
          </Theme>
        </StoreProvider>
      </body>
    </html>
  );
}

export default RootLayout;
