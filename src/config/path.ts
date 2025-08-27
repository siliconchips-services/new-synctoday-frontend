export const rootPaths = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  logs: '/logs',
  users: '/users',
  notifications: '/notifications',
  iam: '/iam',
  tenant: '/tenants',
  application: '/applications',
  role: '/role',
  permission: '/permission',
  coreConfig: '/core-config',
};

export default {
  home: rootPaths.home,
  login: rootPaths.login,
  dashboard: rootPaths.dashboard,
  notifications: rootPaths.notifications,
  core: rootPaths.coreConfig,
  tenant: {
    overview: `${rootPaths.tenant}/overview`,
    list: `${rootPaths.tenant}/list`,
  },
  application: {
    overview: `${rootPaths.application}/overview`,
    list: `${rootPaths.application}/list`,
    view_app: `${rootPaths.application}/view`,
    settings: `${rootPaths.application}/settings`,
    type: `${rootPaths.application}/type`,
  },
  logs: {
    overview: `${rootPaths.logs}/overview`,
    list: `${rootPaths.logs}/list`,
  },
  users: {
    list: `${rootPaths.users}/list`,
    profile: `${rootPaths.users}/profile`,
  },
  role: {
    overview: `${rootPaths.role}/overview`,
    list: `${rootPaths.role}/list`,
  },
  permission: {
    overview: `${rootPaths.permission}/overview`,
    list: `${rootPaths.permission}/list`,
  },
  iam: {
    overview: `${rootPaths.iam}/overview`,
    list: `${rootPaths.iam}/list`,
  },
};
