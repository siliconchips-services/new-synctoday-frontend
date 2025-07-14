import React, { Dispatch, SetStateAction } from 'react';
import { Layout } from 'antd';
import ProfileDropDown from './elements/ProfileDropDown';
import MenuToggle from './elements/MenuToggle';
// import AppsDropDown from './elements/AppsDropDown';
// import NotificationDropDown from './elements/NotificationDropDown';

interface HeaderViewProps {
  userId: string;
  collapsed: boolean;
  SetCollapsed: Dispatch<SetStateAction<boolean>>;
}

const HeaderView: React.FC<HeaderViewProps> = (props) => {
  const { userId, collapsed, SetCollapsed } = props;

  return (
    <Layout.Header className="appHeader">
      <div className="headerWrap">
        <div className="appHeaderLeft">
          <MenuToggle collapsed={collapsed} SetCollapsed={SetCollapsed} />
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
