import React from 'react';
import { Card, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface PageSpinnerProps {
  card?: boolean;
}

const PageSpinner: React.FC<PageSpinnerProps> = ({ card }) => {
  return card ? (
    <div className={'card__spinner__wrapper'}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
      <div className="text-center d-block mt-5">
        <strong>Loading...</strong>
      </div>
    </div>
  ) : (
    <Card className="mainContent box">
      <div className="fullscreen__spinner__wrapper ">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 60 }} spin />} />
        <div className="text-center d-block mt-5">
          <strong>Loading...</strong>
        </div>
      </div>
    </Card>
  );
};

export default PageSpinner;
