import { Result } from 'antd';
import React from 'react';

interface PropsType {
  title?: string;
  subTitle?: string;
}
const DataNotFound: React.FC<PropsType> = (props) => {
  const { title, subTitle } = props;
  return (
    <>
      <Result
        status="404"
        title={title}
        subTitle={subTitle}
        // extra={<Button type="primary">Back Home</Button>}
      />
    </>
  );
};

export default DataNotFound;
