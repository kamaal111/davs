'use client';

import { IntlProvider as ReactIntlProvider } from 'react-intl';

const DEFAULT_LANGUAGE = 'en';

function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = navigator.language?.slice(0, 2) ?? DEFAULT_LANGUAGE;

  return (
    <ReactIntlProvider locale={locale} defaultLocale={DEFAULT_LANGUAGE}>
      {children}
    </ReactIntlProvider>
  );
}

export default IntlProvider;
