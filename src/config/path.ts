export const rootPaths = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  events: '/events',
  users: '/users',
};

export default {
  home: rootPaths.home,
  login: rootPaths.login,
  dashboard: rootPaths.dashboard,
  events: rootPaths.events,

  users: {
    list: `${rootPaths.users}/list`,
    profile: `${rootPaths.users}/profile`,
  },
};
