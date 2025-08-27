import React from 'react';
import { Link } from 'react-router-dom';
import CollapsedLogo from '@/assets/images/app-logo/SyncToday.png';
import path from '@/config/path';
import { getCookie } from '@/utils/cookie';
import { base64ToImageSrc } from '@/config/global';

const LogoComponent: React.FC<any> = ({ collapsed }) => {
  const token = getCookie('token');

  const appDetails = localStorage.getItem('appDetails');
  const appLogoBase64 = appDetails ? JSON.parse(appDetails)?.logoImage : '';
  const appLogo = appLogoBase64
    ? base64ToImageSrc(appLogoBase64)
    : CollapsedLogo;

  return (
    <div className="logoWrapper">
      {collapsed ? (
        <Link to={token ? path.dashboard : path.login}>
          {/* <CollapseLogo style={{ maxWidth: 60 }} /> */}
          <img
            src={appLogo}
            alt='"logo'
            className="collapsedLogo"
            width={'65px'}
          />
        </Link>
      ) : (
        <Link to={token ? path.dashboard : path.login}>
          {/* <Logo /> */}
          <img src={appLogo} alt='"logo' />
        </Link>
      )}
    </div>
  );
};

export default LogoComponent;
