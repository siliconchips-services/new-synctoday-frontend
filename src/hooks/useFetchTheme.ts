import { useEffect, useMemo, useRef } from 'react';
import { updateTheme } from '@/config/theme'; // Ensure this file exists
import { useTheme } from '@/context/ThemeContext';
import { DEFAULT_THEME } from '@/config/Constant';
import { setCookie } from '@/utils/cookie';

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
}

interface ThemeData {
  app_logo?: string;
  primary_font?: string;
  primary_color?: string;
  secondary_color?: string;
}

export const useFetchTheme = (themeData: ThemeData | null) => {
  const { setTheme } = useTheme(); // Always called in the same order
  // const isFirstRender = useRef(true);
  const prevThemeData = useRef<ThemeData | null>(null);

  const memoizedThemeData = useMemo(() => {
    if (!themeData) return null;

    // Compare with previous theme data before updating
    if (JSON.stringify(prevThemeData.current) === JSON.stringify(themeData)) {
      return prevThemeData.current; // Prevent update if data is the same
    }

    prevThemeData.current = themeData;
    return themeData;
  }, [themeData]);

  useEffect(() => {
    // if (isFirstRender.current) {
    //   isFirstRender.current = false; // Skip first render
    //   return;
    // }

    if (!memoizedThemeData) return;

    setTheme((prevTheme) => {
      const updatedTheme: Partial<ThemeContextType> = {
        ...prevTheme,
        ...memoizedThemeData,
      };

      updateTheme({
        app_logo: updatedTheme.app_logo || DEFAULT_THEME.APP_LOGO,
        'primary-font': updatedTheme.primary_font
          ? `'${updatedTheme.primary_font}', sans-serif`
          : DEFAULT_THEME.PRIMARY_FONT,
        'primary-color':
          updatedTheme.primary_color || DEFAULT_THEME.PRIMARY_COLOR,
        'secondary-color':
          updatedTheme.secondary_color || DEFAULT_THEME.SECONDARY_COLOR,
      });

      setCookie('theme', JSON.stringify(updatedTheme));

      return updatedTheme;
    });
  }, [memoizedThemeData]);
};
