import React from 'react';
import AppList from './components/AppList';
import PageHeader from '@/components/PageHeader';
import { DashboardBreadcrumb } from '@/config/BreadcrumbConfig';

const Dashboard: React.FC = () => {
  return (
    <>
      <h2></h2>
      <PageHeader
        // breadcrumbs={DashboardBreadcrumb}
        title={DashboardBreadcrumb.title}
      />
      <AppList />
    </>
  );
};

export default Dashboard;
