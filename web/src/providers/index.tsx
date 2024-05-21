import { Toaster } from 'react-hot-toast';

import Theme from './theme';
import IntlProvider from './intl';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Theme>
      <IntlProvider>
        {children}
        <Toaster />
      </IntlProvider>
    </Theme>
  );
}

export default AppProviders;
