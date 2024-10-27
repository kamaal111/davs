import React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { z } from 'zod';

import Theme from '@/theme/theme-provider';
import IntlProvider from '@/translations/intl-provider';
import StoreProvider from '@/store/store-provider';

import '@radix-ui/themes/styles.css';
import '@/styles/globals.sass';

type RootLayoutProps = React.PropsWithChildren;

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Davs client',
  description: 'Davs client',
};

const sessionSchema = z.object({
  username: z.string(),
});

function RootLayout({ children }: RootLayoutProps) {
  const session = React.use(
    headers().then(requestHeaders => {
      const sessionHeader = requestHeaders.get('session');
      if (!sessionHeader) return null;

      return sessionSchema.safeParse(JSON.parse(sessionHeader)).data ?? null;
    })
  );

  return (
    <html lang="en">
      <body>
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
