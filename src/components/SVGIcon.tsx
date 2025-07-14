import React from 'react';

// Import all SVGs
import HomeIcon from '@/assets/images/icons/home.svg?react';
import UserIcon from '@/assets/images/icons/user.svg?react';
import ChartIcon from '@/assets/images/icons/chart.svg?react';
import RocketIcon from '@/assets/images/icons/rocket.svg?react';
import SettingIcon from '@/assets/images/icons/setting.svg?react';
import BellIcon from '@/assets/images/icons/bell.svg?react';
import CogIcon from '@/assets/images/icons/cog.svg?react';
import ListIcon from '@/assets/images/icons/list.svg?react';
import AppsIcon from '@/assets/images/icons/apps.svg?react';
import OfficeBuildingIcon from '@/assets/images/icons/office-building.svg?react';
import WebDevelopmentIcon from '@/assets/images/icons/web-development.svg?react';
import IdCardIcon from '@/assets/images/icons/id-card.svg?react';
import IdCard2Icon from '@/assets/images/icons/id-card-2.svg?react';
import SecurityPinIcon from '@/assets/images/icons/security-pin.svg?react';
import LogoutIcon from '@/assets/images/icons/logout.svg?react';

// Define a type for icon names
type IconName =
  | 'home'
  | 'user'
  | 'chart'
  | 'rocket'
  | 'setting'
  | 'bell'
  | 'cog'
  | 'apps'
  | 'list'
  | 'idCard'
  | 'idCard2'
  | 'webDevelopment'
  | 'securityPin'
  | 'logout'
  | 'officeBuilding';

// Mapping object for icons
const iconMap: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
  home: HomeIcon,
  user: UserIcon,
  chart: ChartIcon,
  rocket: RocketIcon,
  setting: SettingIcon,
  bell: BellIcon,
  cog: CogIcon,
  list: ListIcon,
  apps: AppsIcon,
  officeBuilding: OfficeBuildingIcon,
  webDevelopment: WebDevelopmentIcon,
  idCard: IdCardIcon,
  idCard2: IdCard2Icon,
  securityPin: SecurityPinIcon,
  logout: LogoutIcon,
};

interface SVGIconProps {
  name: IconName;
  width?: number;
  height?: number;
  color?: string;
}

const SVGIcon: React.FC<SVGIconProps> = ({
  name,
  width = 18,
  height = width,
  color = 'currentColor',
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.error(`SVGIcon: No icon found with name "${name}"`);
    return null;
  }

  return (
    <IconComponent
      width={width}
      height={height ? height : width}
      fill={color}
    />
  );
};

export default SVGIcon;
