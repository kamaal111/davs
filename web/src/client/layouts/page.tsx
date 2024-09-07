import React from 'react';

import ThemeProvider from '../theme/provider';

import './page.css';

function PageLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export default PageLayout;
