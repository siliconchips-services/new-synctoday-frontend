import React from 'react';
import { Layout } from 'antd';
import moment from 'moment';
import { AppConfig } from '@/config/env';

const FooterView: React.FC = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center' }}>
      &copy; {moment().format('Y')}
      <span>
        {' '}
        <strong>{AppConfig?.title ?? ''}</strong>
        {' - '}
      </span>
      All rights reserved to{' '}
      <a
        href="https://www.siliconchips-services.com/"
        target="_blank"
        rel="noreferrer"
      >
        <strong>Siliconchips Services Ltd.</strong>
      </a>
    </Layout.Footer>
  );
};

export default FooterView;
