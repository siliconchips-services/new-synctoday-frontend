import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import logo from '@/assets/images/app-logo/SyncToday.png';
import path from '@/config/path';
import { DEFAULT_THEME } from '@/config/Constant';
import { useFetchTheme } from '@/hooks/useFetchTheme';
import { getCookie } from '@/utils/cookie';

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const { app_logo, authContent } = useTheme();
  const { left_section } = authContent;

  const json = getCookie('userPreference');
  const pref = json ? JSON.parse(json) : {};
  const themeCode = pref?.themeCode ? JSON.parse(pref?.themeCode) : {};

  const pf = themeCode?.['primary-font'] ?? DEFAULT_THEME.PRIMARY_FONT;
  const pc = themeCode?.['primary-color'] ?? DEFAULT_THEME.PRIMARY_COLOR;
  const sc = themeCode?.['secondary-color'] ?? DEFAULT_THEME.SECONDARY_COLOR;

  const data = {
    theme: {
      app_logo: DEFAULT_THEME.APP_LOGO,
      primary_font: pf,
      primary_color: pc,
      secondary_color: sc,
    },
  };
  const themeData = data?.theme;
  useFetchTheme(themeData);

  const token = getCookie('token') ?? null;

  useEffect(() => {
    if (token) {
      navigate(path.dashboard);
    }
  }, [token, navigate]);

  return (
    <Layout.Content className="loginWrapper">
      <div className="bannerSection">
        <div className="box">
          <img
            src={app_logo ? app_logo : logo}
            alt={left_section?.app_name ?? 'logo'}
            className="logo"
          />

          <h2>{left_section?.text_1 ?? 'Publishing Services'}</h2>
          <h2>{left_section?.text_2 ?? 'Technology Solutions'}</h2>
        </div>
        <div className="footer">
          <img
            src={'./siliconchips-services-logo.png'}
            alt={left_section?.app_name ?? 'logo'}
            className="logo"
          />
          <div className="text">
            <a href="https://www.siliconchips-services.com" target="_blank">
              www.siliconchips-services.com
            </a>
          </div>
        </div>
      </div>
      <div className="formSection">
        <Outlet />
      </div>
    </Layout.Content>
  );
};

export default AuthLayout;
