import React from 'react';
import { Card, Result } from 'antd';

const RestrictedAccessPage: React.FC = () => {
  return (
    <Card className="mainContent box">
      <Result
        status="403"
        title="Permission Denied"
        subTitle="Sorry, you are not authorized to access this page."
        // extra={<Button type="primary">Back Home</Button>}
      />
    </Card>
  );
};

export default RestrictedAccessPage;
