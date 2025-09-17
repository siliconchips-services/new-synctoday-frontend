import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import Config from '../../../config/Config';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoComponent from '../Components/LogoComponent';
import {
  camelCaseString,
  base64ToImageSrc,
  parseDomainParts,
} from '@/config/global';

import SVGIcon from '@/components/SVGIcon';
import sidebarMenu from './sidebar';
import { AppDispatch } from '@/store/app';
import { useDispatch } from 'react-redux';
import { openExternalReactApp } from '@/views/modules/Dashboard/utils/openExternalReactApp';
interface AppSidebarViewProps {
  collapsed: boolean;
  SetCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarView: React.FC<AppSidebarViewProps> = ({
  collapsed,
  SetCollapsed,
}) => {
  const dispatch: AppDispatch = useDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const { subDomain } = parseDomainParts(window.location.origin);
  const mainDomain = 'siliconchips-syncapps.com';
  const tenantSubDomain = subDomain || 'platform';

  const [menu, setMenu] = useState<any>([]);
  const [openMenu, setOpenMenu] = useState<any>([]);

  const svgIcons: any = {
    dashboard: <SVGIcon name="home" />,
    users: <SVGIcon name="user" />,
    logs: <SVGIcon name="list" />,
    notifications: <SVGIcon name="bell" />,
    identityAccessManagement: <SVGIcon name="setting" />,
    tenants: <SVGIcon name="officeBuilding" />,
    applications: <SVGIcon name="webDevelopment" />,
    role: <SVGIcon name="idCard" />,
    permission: <SVGIcon name="securityPin" />,
    coreConfig: <SVGIcon name="cog" />,
    birthdaysHolidays: <SVGIcon name="list" />,
  };

  const AppMenu = useCallback((menuItems: any[]): any[] => {
    return menuItems.map((item) => {
      const iconKey = camelCaseString(item.label)
        .replace(' ', '')
        .replace('&', '');
      console.log('iconKey', iconKey);

      const icon = <span className="iconBox">{svgIcons[iconKey]}</span>;

      if (item.children) {
        return {
          key: item.key,
          label: item.label,
          icon,
          children: AppMenu(item.children),
        };
      }

      return {
        key: item.path,
        label: item.label,
        icon,
      };
    });
  }, []);

  const findOpenKeys = (menuItems: any[], path: string): string[] => {
    for (const item of menuItems) {
      if (item.children) {
        const match = item.children.find((child) =>
          path.startsWith(child.path),
        );
        if (match) return [item.key];
      }
    }
    return [];
  };

  const getMCApp = localStorage.getItem('mcApp');
  const mcApp = getMCApp ? JSON.parse(getMCApp) : null;

  const loginLink = mcApp?.subSubDomain
    ? `https://${mcApp.subSubDomain}.${tenantSubDomain}.${mainDomain}`
    : null;

  useEffect(() => {
    let formattedMenu = AppMenu(sidebarMenu);

    // 🎯 Add custom menu only if condition is met
    if (mcApp?.appId === 'de702cdf-d019-41ab-a8af-80333b8bc28e') {
      formattedMenu = [
        ...formattedMenu,
        {
          key: 'dashboard',
          label: (
            <span
              onClick={() => {
                openExternalReactApp({
                  appId: mcApp.appId,
                  appUrl: loginLink,
                  dispatch,
                  target: '_blank', // or "_self"
                });
              }}
            >
              <span>{mcApp?.displayName}</span>
            </span>
          ),
          icon: (
            <span className="iconBox">
              <img
                key={mcApp.appId}
                src={base64ToImageSrc(mcApp?.logoImage)}
                alt={mcApp.displayName}
                style={{ width: 18, height: 18, marginLeft: 4 }}
                loading="lazy"
              />
            </span>
          ),
        },
      ];
    }

    setMenu(formattedMenu);

    const openKeys = findOpenKeys(sidebarMenu, location.pathname);
    setOpenMenu(openKeys);
  }, [
    dispatch,
    location.pathname,
    AppMenu,
    mcApp?.appId,
    mcApp?.displayName,
    mcApp?.logoImage,
    loginLink,
  ]);

  // const handleOpenChange = (keys: string[]) => {
  //   const latestKey = keys.find((key) => !openKeys.includes(key));
  //   setOpenKeys(latestKey ? [latestKey] : []);
  // };

  return (
    <Layout.Sider
      collapsed={collapsed}
      width={Config.sidebar_width}
      collapsedWidth={Config.collapsedWidth}
      className="appSidebar"
      breakpoint="xl"
      onBreakpoint={(event: boolean) => {
        SetCollapsed(event);
      }}
    >
      <div className="header">
        <LogoComponent collapsed={collapsed} />
        {collapsed ? (
          <h3 className="title">ST</h3>
        ) : (
          <h3 className="title">SyncToday</h3>
        )}
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]}
        openKeys={openMenu}
        onOpenChange={(keys) => setOpenMenu(keys)}
        items={menu}
        onClick={(item) => navigate(item.key)}
      />
    </Layout.Sider>
  );
};

export default SidebarView;
