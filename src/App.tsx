import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router from '@/config/RouterConfig';
import { useFetchTheme } from '@/hooks/useFetchTheme';
import { useTheme } from '@/context/ThemeContext';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import { DEFAULT_THEME } from '@/config/Constant';
import { getCookie } from './utils/cookie';

function App() {
  const [isThemeLoaded, setIsThemeLoaded] = useState<boolean>(false);
  const { setAuthContent } = useTheme();

  const json = getCookie('userPreference');
  const pref = json ? JSON.parse(json) : {};
  const pf = pref?.themeCode?.['primary-font'] ?? DEFAULT_THEME.PRIMARY_FONT;
  const pc = pref?.themeCode?.['primary-color'] ?? DEFAULT_THEME.PRIMARY_COLOR;
  const sc =
    pref?.themeCode?.['secondary-color'] ?? DEFAULT_THEME.SECONDARY_COLOR;

  const data = {
    theme: {
      app_logo: DEFAULT_THEME.APP_LOGO,
      primary_font: pf,
      primary_color: pc,
      secondary_color: sc,
      // yts_color: '#00A5CF',
      // yta_color: '#25A18E',
      // ipr_color: '#EDAE49',
      // pnd_color: '#FF6B35',
    },
    text: {
      left_section: {
        app_name: 'SyncToday',
        text_1: 'SyncToday',
        text_2: '',
      },
      right_section: {
        title: 'Welcome',
        login_id_label: 'Login ID',
        password_label: 'Password',
        button_label: 'Login',
      },
    },
  };
  const themeData = data?.theme;
  const authContent = data?.text;
  useFetchTheme(themeData);

  useEffect(() => {
    setAuthContent(authContent);
    setIsThemeLoaded(true);
  }, [isThemeLoaded]);

  // useEffect(() => {
  //   logActivity({
  //     level: 'Information',
  //     className: 'App',
  //     method: 'useEffect',
  //     message: 'App mounted',
  //   });
  // }, []);

  return (
    <>
      <BrowserRouter>
        {isThemeLoaded ? <Router /> : <PageSpinner />}
      </BrowserRouter>
    </>
  );
}

export default App;
