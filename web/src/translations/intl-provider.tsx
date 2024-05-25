'use client';

import { IntlProvider as ReactIntlProvider } from 'react-intl';

import { DEFAULT_LANGUAGE, getLocale, getMessages } from './messages';

function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const messages = getMessages();

  return (
    <ReactIntlProvider
      locale={locale}
      messages={messages}
      defaultLocale={DEFAULT_LANGUAGE}
    >
      {children}
    </ReactIntlProvider>
  );
}

export default IntlProvider;
