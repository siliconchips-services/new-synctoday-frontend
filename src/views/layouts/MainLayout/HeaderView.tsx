import React from 'react';
import { Layout } from 'antd';
import ProfileDropDown from './elements/ProfileDropDown';
import LogoComponent from '../Components/LogoComponent';
// import AppsDropDown from './elements/AppsDropDown';
// import NotificationDropDown from './elements/NotificationDropDown';

interface HeaderViewProps {
  userId: string;
  // collapsed: boolean;
  // SetCollapsed: Dispatch<SetStateAction<boolean>>;
}

const HeaderView: React.FC<HeaderViewProps> = (props) => {
  const { userId } = props;

  const appDetails = localStorage.getItem('appDetails');
  const appName = appDetails
    ? JSON.parse(appDetails)?.displayName
    : 'SyncToday';

  return (
    <Layout.Header className="appHeader">
      <div className="headerWrap">
        <div className="appHeaderLeft">
          {/* <MenuToggle collapsed={collapsed} SetCollapsed={SetCollapsed} /> */}
          <div className="header">
            {/* <div className="appSidebar"> */}
            <LogoComponent collapsed={false} />
            <h3 className="title">{appName}</h3>
          </div>
          {/* </div> */}
        </div>
        <div className="appHeaderRight">
          {/* <NotificationDropDown /> */}
          {/* <AppsDropDown /> */}
          <ProfileDropDown userId={userId} />
        </div>
      </div>
    </Layout.Header>
  );
};

export default HeaderView;
