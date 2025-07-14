import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/assets/images/app-logo/SyncToday.png';
import CollapsedLogo from '@/assets/images/app-logo/SyncToday.png';
import path from '@/config/path';
import Cookies from 'js-cookie';

const LogoComponent: React.FC<any> = ({ collapsed }) => {
  const token = Cookies.get('token');

  return (
    <div className="logoWrapper">
      {collapsed ? (
        <Link to={token ? path.dashboard : path.login}>
          {/* <CollapseLogo style={{ maxWidth: 60 }} /> */}
          <img
            src={CollapsedLogo}
            alt='"logo'
            className="collapsedLogo"
            width={'65px'}
          />
        </Link>
      ) : (
        <Link to={token ? path.dashboard : path.login}>
          {/* <Logo /> */}
          <img src={Logo} alt='"logo' />
        </Link>
      )}
    </div>
  );
};

export default LogoComponent;
