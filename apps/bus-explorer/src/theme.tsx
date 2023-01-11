import type React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const theme = createTheme();

export interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider = ({ children, ...rest }: AppThemeProviderProps) => (
  <ThemeProvider {...rest} theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
