import React from 'react';

import ThemeProvider from '../theme/provider';

import './page.css';

function PageLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <ThemeProvider>
      <h1 className="title">{title}</h1>
      {children}
    </ThemeProvider>
  );
}

export default PageLayout;
