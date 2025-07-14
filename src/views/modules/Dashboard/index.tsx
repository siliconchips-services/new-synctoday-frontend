import PageHeader from '@/components/PageHeader';
import { DashboardOverview } from '@/config/BreadcrumbConfig';
import { Card } from 'antd';
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <>
      <PageHeader
        // breadcrumbs={DashboardOverview}
        title={DashboardOverview.title}
      />
      <Card className="mainContent box">
        <p>Dashboard content comes here...</p>
      </Card>
    </>
  );
};

export default Dashboard;
