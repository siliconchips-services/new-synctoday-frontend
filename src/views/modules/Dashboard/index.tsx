import React from 'react';
import PageHeader from '@/components/PageHeader';
import { DashboardOverview } from '@/config/BreadcrumbConfig';
import { Card, Col, Row } from 'antd';
import AppList from './components/AppList';
import HolidaySlider from './components/HolidaySlider';
import TodayBirthdayAnniversary from './components/TodayBirthdayAnniversary';
import UpcomingBirthdayAnniversary from './components/UpcomingBirthdayAnniversary';

const Dashboard: React.FC = () => {
  return (
    <>
      <PageHeader title={DashboardOverview.title} />
      <Card className="mainContent box">
        <Row gutter={[30, 30]}>
          <Col xs={24} md={12} lg={16}>
            <AppList />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <TodayBirthdayAnniversary />
            <UpcomingBirthdayAnniversary />
            <HolidaySlider />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Dashboard;
