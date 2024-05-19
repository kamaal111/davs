import {
  Theme as RadixTheme,
  ThemePanel as RadixThemePanel,
} from '@radix-ui/themes';
import type { ThemeProps } from '@radix-ui/themes';

const theme: ThemeProps = {
  accentColor: 'amber',
  grayColor: 'olive',
  radius: 'large',
  scaling: '95%',
};

function Theme({
  children,
  themePanel,
}: {
  children: React.ReactNode;
  themePanel?: boolean;
}) {
  return (
    <RadixTheme {...theme}>
      {children}
      <ThemePanel themePanel={themePanel} />
    </RadixTheme>
  );
}

function ThemePanel({ themePanel }: { themePanel?: boolean }) {
  if (!themePanel) return null;
  return <RadixThemePanel />;
}

export default Theme;
