import React from 'react';
import useSchema from '../hooks/use-schema';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const DEFAULT_THEME = 'system';
const THEME_STORAGE_KEY = 'davs_ui_theme_schema';

const initialState: ThemeProviderState = {
  theme: DEFAULT_THEME,
  setTheme: () => null,
};

const ThemeProviderContext =
  React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || DEFAULT_THEME
  );

  const schema = useSchema();

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      root.classList.remove('light', 'dark');
      root.classList.add(schema ?? 'light');
      return;
    }

    root.classList.add(theme);
  }, [theme, schema]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export default ThemeProvider;
