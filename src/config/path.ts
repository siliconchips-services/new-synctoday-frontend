export const rootPaths = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  dashboardMC: '/dashboardMC',
  events: '/events',
  users: '/users',
};

export default {
  home: rootPaths.home,
  login: rootPaths.login,
  dashboard: rootPaths.dashboard,
  dashboardMC: rootPaths.dashboardMC,
  events: rootPaths.events,

  users: {
    list: `${rootPaths.users}/list`,
    profile: `${rootPaths.users}/profile`,
  },
};
