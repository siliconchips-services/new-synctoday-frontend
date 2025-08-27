import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import 'antd/dist/reset.css';
import '@/assets/styles/main.less';
import App from '@/App';
import { ConfigProvider, App as AntdApp } from 'antd';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './store/app';
import { setGlobalNotification } from '@/config/globalNotification';
import { LoadingOutlined } from '@ant-design/icons';
import type { SpinProps } from 'antd';
import { DEFAULT_THEME } from './config/Constant';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// const json = Cookies.get('userPreference');
// const pref = json ? JSON.parse(json) : {};
// const primaryColor =
//   pref?.themeCode?.['primary-color'] ?? DEFAULT_THEME.PRIMARY_COLOR;
// alert(primaryColor);

const AppWithTheme = () => {
  const { primary_color } = useTheme();
  const { notification } = AntdApp.useApp();

  useEffect(() => {
    setGlobalNotification(notification); // set the instance globally
  }, [notification]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primary_color,
          borderRadius: DEFAULT_THEME.BORDER_RADIUS,
        },
        hashed: false,
      }}
      spin={
        {
          indicator: antIcon,
        } as SpinProps
      }
    >
      <App />
    </ConfigProvider>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AntdApp>
      <ThemeProvider>
        <Provider store={store}>
          <AppWithTheme />
        </Provider>
      </ThemeProvider>
    </AntdApp>
  </StrictMode>,
);
