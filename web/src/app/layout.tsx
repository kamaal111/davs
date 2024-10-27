import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { z } from 'zod';

import Theme from '@/theme/theme-provider';
import IntlProvider from '@/translations/intl-provider';
import StoreProvider from '@/store/store-provider';

import '@radix-ui/themes/styles.css';
import '@/styles/globals.sass';

const inter = Inter({ subsets: ['latin'] });

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Davs client',
  description: 'Davs client',
};

const sessionSchema = z.object({
  username: z.string(),
});

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = React.use(
    headers().then(requestHeaders => {
      const sessionHeader = requestHeaders.get('session');
      if (!sessionHeader) return null;

      return sessionSchema.safeParse(JSON.parse(sessionHeader)).data ?? null;
    })
  );

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
