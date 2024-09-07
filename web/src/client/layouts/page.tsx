import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';

import ThemeProvider from '../theme/provider';

import useMessages from '@/translations/hooks/use-messages';
import { DEFAULT_LANGUAGE } from '@/translations/constants';

import './page.css';

function PageLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { locale, messages } = useMessages();

  return (
    <ReactIntlProvider
      locale={locale}
      messages={messages}
      defaultLocale={DEFAULT_LANGUAGE}
    >
      <ThemeProvider>
        <h1 className="title">{title}</h1>
        {children}
      </ThemeProvider>
    </ReactIntlProvider>
  );
}

export default PageLayout;
