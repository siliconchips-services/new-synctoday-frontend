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

export const UserProfileBreadcrumb = createBreadcrumb('Profile', [
  {
    name: 'User Profile',
    link: path.users.profile,
  },
]);

export const DashboardBreadcrumb = createBreadcrumb('Applications', [
  {
    name: 'User Profile',
    link: path.users.profile,
  },
]);

export const EventsBreadcrumb = createBreadcrumb('Birthdays and Holidays', [
  {
    name: 'Events',
    link: path.events,
  },
]);
