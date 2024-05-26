'use client';

import { IntlProvider as ReactIntlProvider } from 'react-intl';

import useMessages from './hooks/use-messages';
import { DEFAULT_LANGUAGE } from './constants';

function IntlProvider({ children }: { children: React.ReactNode }) {
  const { locale, messages } = useMessages();

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
