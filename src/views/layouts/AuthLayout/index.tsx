import React, { useCallback, useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/app-logo/SyncToday.png';
import path from '@/config/path';
import { DEFAULT_THEME } from '@/config/Constant';
import { useFetchTheme } from '@/hooks/useFetchTheme';
import { getCookie } from '@/utils/cookie';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import { getAppDetails } from '@/views/modules/Auth/utils/AuthSlice';
import PageSpinner from '@/components/PageSpinner/PageSpinner';
import { base64ToImageSrc, stripProtocol } from '@/config/global';

const AuthLayout: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();

  const [isShow, setIsShow] = useState<boolean>(false);

  const [tenantData, setTenantData] = useState<any>(() => {
    const data = localStorage.getItem('tenantDetails');
    return data ? JSON.parse(data) : null;
  });
  const [appData, setAppData] = useState<any>(() => {
    const data = localStorage.getItem('appDetails');
    return data ? JSON.parse(data) : null;
  });
  const tenantAppCode = import.meta.env.VITE_APP_TENANT_APP_CODE;

  const fetchAppDetails = useCallback(async () => {
    setIsShow(false);
    const payload = {
      code: tenantAppCode,
      subDomain: 'platform',
      subSubDomain: 'synctoday',
    };
    await dispatch(getAppDetails(payload))
      .then((res: any) => {
        if (res?.data) {
          localStorage.setItem(
            'tenantDetails',
            JSON.stringify(res?.data?.tenant),
          );
          setTenantData(res?.data?.tenant);
          localStorage.setItem(
            'appDetails',
            JSON.stringify(res?.data?.application),
          );
          setAppData(res?.data?.application);
        }
      })
      .catch((error) => {
        console.warn('Error fetching application details: ', error);
      })
      .finally(() => {
        setIsShow(true);
      });
  }, [dispatch, tenantAppCode]);

  useEffect(() => {
    fetchAppDetails();
  }, [fetchAppDetails]);

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

  return isShow ? (
    <Layout.Content className="loginWrapper">
      <div className="bannerSection">
        <div className="box">
          <img
            src={base64ToImageSrc(appData.logoImage) || logo}
            alt={appData?.displayName ?? 'SyncToday'}
            className="logo"
          />

          <h2>{appData?.displayName ?? 'SyncToday'}</h2>
        </div>
        <div className="footer">
          <img
            src={
              base64ToImageSrc(tenantData?.logoImage) ||
              './siliconchips-services-logo.png'
            }
            alt={tenantData?.displayName ?? 'logo'}
            className="logo"
          />
          <div className="text">
            <a
              href={
                tenantData?.website || 'https://www.siliconchips-services.com'
              }
              target="_blank"
            >
              {tenantData?.website
                ? stripProtocol(tenantData?.website)
                : 'www.siliconchips-services.com'}
            </a>
          </div>
        </div>
      </div>
      <div className="formSection">
        <Outlet />
      </div>
    </Layout.Content>
  ) : (
    <PageSpinner card={false} />
  );
};

export default AuthLayout;
