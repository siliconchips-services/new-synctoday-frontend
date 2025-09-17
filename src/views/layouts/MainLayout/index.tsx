import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarView from './SidebarView';
import HeaderView from './HeaderView';
import path from '@/config/path';
import FooterView from './FooterView';
import { useFetchTheme } from '@/hooks/useFetchTheme';
import { DEFAULT_THEME } from '@/config/Constant';
import { getCookie } from '@/utils/cookie';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, SetCollapsed] = useState<boolean>(false);

  const json = getCookie('userPreference') || '';
  const userID = getCookie('userID') || '';
  const userId = userID ? userID : '';
  const pref = json ? JSON.parse(json) : {};
  const themeCode = pref?.themeCode ? JSON.parse(pref?.themeCode) : {};

  const pf = themeCode?.['primary-font'] ?? DEFAULT_THEME.PRIMARY_FONT;
  const pc = themeCode?.['primary-color'] ?? DEFAULT_THEME.PRIMARY_COLOR;
  const sc = themeCode?.['secondary-color'] ?? DEFAULT_THEME.SECONDARY_COLOR;

  const theme = {
    app_logo: DEFAULT_THEME.APP_LOGO,
    primary_font: pf,
    primary_color: pc,
    secondary_color: sc,
  };
  const themeData = theme;
  useFetchTheme(themeData);

  const token = getCookie('token') ?? null;

  useEffect(() => {
    if (!token) {
      navigate(path.login);
    }
  }, [token, navigate]);

  return (
    <Layout className={`mainPageWrapper has_appSidebar`}>
      <SidebarView collapsed={collapsed} SetCollapsed={SetCollapsed} />
      <Layout className={`site-layout`}>
        <HeaderView
          collapsed={collapsed}
          SetCollapsed={SetCollapsed}
          userId={userId}
        />
        <Layout.Content className={`appContent`}>
          <Outlet />
        </Layout.Content>
        <FooterView />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
