import Theme from './theme';
import IntlProvider from './intl';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Theme>
      <IntlProvider>{children}</IntlProvider>
    </Theme>
  );
}

export default AppProviders;
