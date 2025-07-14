import path from '@/config/path';

const sidebarMenu = [
  {
    key: 'dashboard',
    path: path.dashboard,
    label: 'Dashboard',
  },

  {
    key: 'users',
    label: 'Users',
    path: path.users.list,
  },
];

export default sidebarMenu;
