import React from 'react';

import { Card } from 'antd';
import HolidaySlider from './components/HolidaySlider';
import TodayBirthdayAnniversary from './components/TodayBirthdayAnniversary';
import UpcomingBirthdayAnniversary from './components/UpcomingBirthdayAnniversary';
import PageHeader from '@/components/PageHeader';
import { EventsBreadcrumb } from '@/config/BreadcrumbConfig';

const Events: React.FC = () => {
  return (
    <>
      <PageHeader
        breadcrumbs={EventsBreadcrumb}
        title={EventsBreadcrumb.title}
      />
      <Card className="mainContent box ">
        <div className="eventsContainer">
          <TodayBirthdayAnniversary />
          <UpcomingBirthdayAnniversary />
          <HolidaySlider />
        </div>
      </Card>
    </>
  );
};

export default Events;
