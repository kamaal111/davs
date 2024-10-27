import {
  Theme as RadixTheme,
  ThemePanel as RadixThemePanel,
  type ThemeProps,
} from '@radix-ui/themes';
import { type DefaultToastOptions, Toaster } from 'react-hot-toast';

type ThemeProviderProps = React.PropsWithChildren<{ themePanel?: boolean }>;

const theme: ThemeProps = {
  accentColor: 'amber',
  grayColor: 'olive',
  radius: 'large',
  scaling: '95%',
};

const toastOptions: DefaultToastOptions = {
  error: {
    duration: 3000,
    style: { background: '#DD2712', color: '#ffffff' },
  },
};

function Theme({ children, themePanel }: ThemeProviderProps) {
  return (
    <RadixTheme {...theme}>
      {children}
      <Toaster toastOptions={toastOptions} />
      <ThemePanel themePanel={themePanel} />
    </RadixTheme>
  );
}

function ThemePanel({ themePanel }: { themePanel?: boolean }) {
  if (!themePanel) return null;
  return <RadixThemePanel />;
}

export default Theme;
