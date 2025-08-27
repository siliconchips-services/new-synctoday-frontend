import { useRoutes } from 'react-router-dom';
import paths from './path';

import ModuleWrap from '../components/ModuleWrap';

import AuthLayout from '../views/layouts/AuthLayout';
import MainLayout from '../views/layouts/MainLayout';

import Login from '../views/modules/Auth/Login';
import PageNotFound from '../views/errors/PageNotFound';

import Dashboard from '../views/modules/Dashboard';

import Users from '@/views/modules/Users';
import UserProfile from '@/views/modules/Users/components/UserProfile';

export default function Router() {
  return useRoutes(RouterConfig);
}

export const RouterConfig = [
  {
    element: <AuthLayout />,
    children: [
      {
        path: paths.home,
        element: <Login />,
      },
      {
        path: paths.login,
        element: <Login />,
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: paths.home,
        element: <ModuleWrap module={Dashboard} />,
      },
      {
        path: paths.dashboard,
        element: <ModuleWrap module={Dashboard} />,
      },

      {
        path: paths.users.list,
        element: <ModuleWrap module={Users} />,
      },
      {
        path: paths.users.profile,
        element: <ModuleWrap module={UserProfile} />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
];
