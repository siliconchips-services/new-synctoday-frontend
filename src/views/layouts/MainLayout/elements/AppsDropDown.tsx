import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Popover } from 'antd';
import SVGIcon from '@/components/SVGIcon';
import SyncToday from '@/assets/images/app-logo/SyncToday.png';
import EditorialPublish from '@/assets/images/app-logo/EditorialPublish.png';
import PublishingSuite from '@/assets/images/app-logo/PublishingSuite.png';
import AuditEdge from '@/assets/images/app-logo/AuditEdge.png';
import ConnectHub from '@/assets/images/app-logo/ConnectHub.png';
import LabSuite from '@/assets/images/app-logo/LabSuite.png';

const AppsDropDown: React.FC = () => {
  const navigate = useNavigate();

  const appList = (
    <div className="appsDropDown">
      <ul className="menu">
        <li onClick={() => navigate('#app')}>
          <img src={SyncToday} alt="SyncToday" height={60} />
          <span>SyncToday</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <img src={EditorialPublish} alt="EditorialPublish" height={60} />
          <span>EditorialPublish</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <img src={PublishingSuite} alt="PublishingSuite" height={60} />
          <span>PublishingSuite</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <img src={AuditEdge} alt="AuditEdge" height={60} />
          <span>AuditEdge</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <img src={ConnectHub} alt="ConnectHub" height={60} />
          <span>ConnectHub</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <img src={LabSuite} alt="LabSuite" height={60} />
          <span>LabSuite</span>
        </li>
      </ul>
    </div>
  );

  return (
    <Popover
      content={appList}
      trigger="hover"
      placement="bottomRight"
      arrow
      classNames={{
        root: 'appList',
      }}
    >
      <div className="pointer d-flex">
        <SVGIcon name="apps" width={20} />
      </div>
    </Popover>
  );
};

export default AppsDropDown;
