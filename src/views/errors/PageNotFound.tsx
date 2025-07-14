import { Button, Space } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import NotFoundImg from '../../assets/images/404_images.png';
import Cookies from 'js-cookie';
import path from '@/config/path';
import DataNotFound from './DataNotFound';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const token = Cookies.get('token');
  return (
    <>
      <div className="mainContent text-center">
        <DataNotFound title={'Sorry, the page you visited does not exist.'} />
        <Space size="large">
          {token ? (
            <Button
              size="middle"
              type="primary"
              onClick={() => navigate(path.dashboard)}
            >
              Back to Dashboard
            </Button>
          ) : (
            <Button
              size="middle"
              type="primary"
              onClick={() => navigate(path.login)}
            >
              Login
            </Button>
          )}
        </Space>
      </div>
    </>
  );
};

export default PageNotFound;
