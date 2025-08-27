import React from 'react';
import { Badge, Popover } from 'antd';
import SVGIcon from '@/components/SVGIcon';

const NotificationDropDown: React.FC = () => {
  const appList = (
    <div className="NotificationDropDown">
      Notification Will Comes Here...
      <br />
      Notification Will Comes Here...
      <br />
      Notification Will Comes Here...
      <br />
      Notification Will Comes Here...
      <br />
      Notification Will Comes Here...
      {/* <ul className="menu">
        <li onClick={() => navigate('#app')}>
          <img src={SyncToday} alt="SyncToday" height={40} />
          <span>SyncToday</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <SVGIcon name="chart" width={40} />
          <span>Edgar</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <SVGIcon name="list" width={40} />
          <span>Paginator</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <SVGIcon name="setting" width={40} />
          <span>Edgar</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <SVGIcon name="cog" width={40} />
          <span>Paginator</span>
        </li>
        <li onClick={() => navigate('#app')}>
          <SVGIcon name="rocket" width={40} />
          <span>SyncToday</span>
        </li>
      </ul> */}
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
      <div className="pointer d-flex notification">
        <Badge count={8} overflowCount={10} size="small">
          <SVGIcon name="bell" width={20} />
        </Badge>
      </div>
    </Popover>
  );
};

export default NotificationDropDown;
