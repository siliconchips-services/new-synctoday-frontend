import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import Config from '../../../config/Config';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoComponent from '../Components/LogoComponent';
import { camelCaseString } from '@/config/global';

import SVGIcon from '@/components/SVGIcon';
import sidebarMenu from './sidebar';

interface AppSidebarViewProps {
  collapsed: boolean;
  SetCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarView: React.FC<AppSidebarViewProps> = ({
  collapsed,
  SetCollapsed,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
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
  };

  const AppMenu = useCallback((menuItems: any[]): any[] => {
    return menuItems.map((item) => {
      const iconKey = camelCaseString(item.label)
        .replace(' ', '')
        .replace('&', '');
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

  useEffect(() => {
    const formattedMenu = AppMenu(sidebarMenu);
    setMenu(formattedMenu);

    const openKeys = findOpenKeys(sidebarMenu, location.pathname);
    setOpenMenu(openKeys);
  }, [location.pathname, AppMenu]);

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
