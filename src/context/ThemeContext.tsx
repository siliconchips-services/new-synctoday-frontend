import { DEFAULT_THEME } from '@/config/Constant';
import React, { createContext, useContext, useMemo, useState } from 'react';

// Define AuthContent type
interface AuthContent {
  left_section: {
    app_name: string;
    text_1: string;
    text_2: string;
  };
  right_section: {
    title: string;
    login_id_label: string;
    password_label: string;
    button_label: string;
  };
}

const defaultTheme: ThemeContextType = {
  app_logo: DEFAULT_THEME.APP_LOGO,
  primary_font: DEFAULT_THEME.PRIMARY_FONT,
  primary_color: DEFAULT_THEME.PRIMARY_COLOR,
  secondary_color: DEFAULT_THEME.SECONDARY_COLOR,
  setTheme: () => {}, // Placeholder function
  authContent: null, // Default value for auth content
  setAuthContent: () => {}, // Placeholder function
};

// Define the structure of the theme
interface ThemeContextType {
  app_logo: string;
  primary_font: string;
  primary_color: string;
  secondary_color: string;

  setTheme: (
    theme:
      | Partial<ThemeContextType>
      | ((prevTheme: ThemeContextType) => Partial<ThemeContextType>),
  ) => void;
  authContent: AuthContent | null; // Add authContent state
  setAuthContent: React.Dispatch<React.SetStateAction<AuthContent | null>>; // Setter for auth content
}

// Create context
const ThemeContext = createContext<ThemeContextType>(defaultTheme);

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeContextType>(defaultTheme);
  const [authContent, setAuthContent] = useState<AuthContent | null>(null);

  const value = useMemo(
    () => ({ ...theme, setTheme, authContent, setAuthContent }),
    [theme, authContent],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
