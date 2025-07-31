import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import { fetchAppsList } from '../utils/dashboardSlice';
import { getCookie } from '@/utils/cookie';
import { base64ToImageSrc } from '@/config/global';

const AppList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
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

  const appBox = (app) => {
    return (
      <li>
        {app?.logoImage && (
          <img
            key={app.appId}
            src={base64ToImageSrc(app?.logoImage)}
            alt={app.displayName}
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
            }}
          />
        )}
        <strong>{app.displayName}</strong>
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
              <>
                <ul className="appList">
                  {appList.length > 0 ? (
                    appList.map((app: any) => {
                      return (
                        <>
                          {appBox(app)}
                          {appBox(app)}
                          {appBox(app)}
                          {appBox(app)}
                        </>
                      );
                    })
                  ) : (
                    <li className="text-center mt-20">
                      <p>No applications found.</p>
                    </li>
                  )}
                </ul>
              </>
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
