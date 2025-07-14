import path from './path';

type BreadcrumbComponentItemTypes = {
  name: React.ReactNode;
  link?: string;
};

interface BreadcrumbConfigProps {
  title: string;
  path: BreadcrumbComponentItemTypes[];
}

const defaultBreadcrumbPath: BreadcrumbComponentItemTypes[] = [
  { name: 'Dashboard', link: '/' },
];

export const createBreadcrumb = (
  title: string,
  subPaths: BreadcrumbComponentItemTypes[] = [],
): BreadcrumbConfigProps => ({
  title,
  path: [...defaultBreadcrumbPath, ...subPaths],
});

// Dashboard
export const DashboardOverview = createBreadcrumb('Dashboard');

// Logs
export const LogsOverview = createBreadcrumb('Overview of Logs', [
  {
    name: 'Logs Overview',
    link: path.logs.overview,
  },
]);
export const LogsList = createBreadcrumb('List of Logs', [
  {
    name: 'Logs List',
    link: path.logs.list,
  },
]);

// Applications
export const ApplicationOverview = createBreadcrumb(
  'Overview of Applications',
  [
    {
      name: 'Application Overview',
      link: path.application.overview,
    },
  ],
);
export const ApplicationBreadcrumb = createBreadcrumb('List of Applications', [
  {
    name: 'Applications List',
    link: path.application.list,
  },
]);
export const ApplicationTypeList = createBreadcrumb('Types of Application', [
  {
    name: 'Application Type List',
    link: path.application.list,
  },
]);
export const CoreConfigBreadcrumb = createBreadcrumb('Core Config', [
  {
    name: 'Core Config',
    link: path.core,
  },
]);

export const TenantBreadcrumb = createBreadcrumb('List of Tenants', [
  {
    name: 'Tenants List',
    link: path.tenant.list,
  },
]);

export const UsersBreadcrumb = createBreadcrumb('List of Users', [
  {
    name: 'Users List',
    link: path.tenant.list,
  },
]);

export const UserProfileBreadcrumb = createBreadcrumb('Profile', [
  {
    name: 'User Profile',
    link: path.tenant.list,
  },
]);
