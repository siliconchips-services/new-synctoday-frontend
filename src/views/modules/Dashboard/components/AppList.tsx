import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, Skeleton, Spin } from 'antd';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import { fetchAppsList } from '../utils/dashboardSlice';
import { getCookie } from '@/utils/cookie';
import { base64ToImageSrc, parseDomainParts } from '@/config/global';
import { openExternalReactApp } from '../utils/openExternalReactApp';
import { openExternalApp } from '../utils/openExternalApp';
const defaultAppLogo =
  'https://placehold.co/90/DDD/31343C?font=poppins&text=Icon\nMissing';

const AppList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appList, setAppList] = useState<any[]>([]);

  const tenantId = getCookie('tenantID');
  const userId = getCookie('userID');

  const handleUsersList = React.useCallback(async () => {
    setLoading(true);

    if (tenantId && userId) {
      try {
        const action: any = await dispatch(fetchAppsList(tenantId, userId));
        const res = action.apps;
        setAppList(res || []);
      } catch (error) {
        console.warn('Error: ', error);
      } finally {
        setLoading(false);
      }
    }
  }, [tenantId, userId, dispatch]);

  useEffect(() => {
    handleUsersList();
  }, [handleUsersList]);

  const appBox = (app, index) => {
    // const MC_React_loginUrl = 'http://localhost:5174/login';

    const { subDomain } = parseDomainParts(window.location.origin);

    // console.log('Sub-sub-domain:', subSubDomain); // "synctoday"
    // console.log('Sub-domain:', subDomain); // "platform"
    // console.log('Domain:', domain); // "siliconchips-syncapps.com"

    const mainDomain = 'siliconchips-syncapps.com';
    // (domain || 'siliconchips-syncapps.com');
    const tenantSubDomain = subDomain || 'platform';

    const loginEndpoint = app.loginMethod === 'token' ? app.loginUrl : '';

    const loginLink = app.subSubDomain
      ? `https://${app.subSubDomain}.${tenantSubDomain}.${mainDomain}${loginEndpoint}`
      : null;

    return (
      <li
        key={index}
        className="appBox"
        onClick={() =>
          app.appId === 'de702cdf-d019-41ab-a8af-80333b8bc28e'
            ? openExternalReactApp({
                appId: app.appId,
                appUrl: loginLink,
                dispatch,
                setIsLoading,
                target: '_blank',
              })
            : loginLink !== null
              ? openExternalApp({
                  appId: app.appId,
                  appUrl: loginLink,
                  dispatch,
                  setIsLoading,
                  target: '_blank',
                })
              : alert(
                  'This application is not available for external access. Please contact your administrator.',
                )
        }
        style={{ cursor: 'pointer' }}
      >
        {isLoading ? (
          <>
            <Skeleton.Image
              active={isLoading}
              style={{
                width: 90,
                height: 90,
              }}
            />
            <strong>{app.displayName}</strong>
          </>
        ) : (
          <>
            {app?.logoImage ? (
              <img
                key={app.appId}
                src={base64ToImageSrc(app?.logoImage)}
                alt={app.displayName}
                loading="lazy"
              />
            ) : (
              <Image
                src={base64ToImageSrc(app?.logoImage)}
                fallback={defaultAppLogo}
              />
            )}
            <strong>{app.displayName}</strong>
          </>
        )}
      </li>
    );
  };

  return (
    <>
      <Card className="box">
        <Row>
          <Col xs={24}>
            <h2>Applications</h2>
            {!loading ? (
              <ul className="appList" key={'appList'}>
                {appList.length > 0 ? (
                  appList.map((app: any, index: number) => appBox(app, index))
                ) : (
                  <li className="text-center mt-20" key={'noApps'}>
                    <p>No applications found.</p>
                  </li>
                )}
              </ul>
            ) : (
              <div className="text-center mt-20">
                <Spin size="large" />
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default AppList;
