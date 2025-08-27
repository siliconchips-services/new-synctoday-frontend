const API_URL = {
  AUTH: {
    LOGIN: `tenantidentity/userlogin`,
    APP_LOGIN: `tenantidentity/userapplogin`,
    USER_PREFERENCE: `tenantidentity/userpreference`,
    TENANT_APP_SUMMARY: `tenantidentity/tenantappsummary`,
  },
  PLATFORM_IDENTITY: {
    APP_LOGIN: `platform/applogin`,
  },

  USERS: {
    ADD: 'tenantidentity/user',
    EDIT: 'tenantidentity/user/me',
    LIST: 'tenantidentity/users',
    DETAILS: 'tenantidentity/user/summary',
    USER_PROFILE_IMAGE: `tenantidentity/user/profile-image`,

    PREFERENCE: 'tenantidentity/userpreference',
    UPDATE_PREFERENCE: 'tenantidentity/userpreference',

    CHANGE_PASSWORD: 'tenantidentity/users/reset-password',
    GENERATE_PASSWORD: 'tenantidentity/users/generate-password',
    APP_LIST: 'tenantidentity/userapps',
    USER_ROLE_LIST: 'platform/userroles',
    USER_ROLE_EDIT: 'platform/userrole',
  },

  CORE: {
    LOCATIONS: {
      LIST: 'countrystatecity',
      ADD: 'countrystatecity',
      EDIT: 'countrystatecity',
      COUNTRIES: 'countries',
      STATES: 'states',
      CITIES: 'cities',
    },
    LANGUAGES: {
      LIST: 'language/detail',
      ADD: 'language',
      EDIT: 'language',
      DD_LIST: 'language/summary',
    },
    TIMEZONES: {
      LIST: 'timezone',
      ADD: 'timezone',
      EDIT: 'timezone',
      DATE_FORMATE: 'dateformats',
      TIME_FORMATE: 'timeformats',
    },
  },
  APPS: {
    LIST: 'applications',
  },
  APPS_TYPE: {
    LIST: 'applicationtypes',
  },
  TENANT: {
    LIST: 'tenants',
  },
  LOGS: {
    ADD: 'log',
    LIST: 'logs',
    DELETE: 'logs',
    EXPORT: 'export/logs',
  },
};

export default API_URL;
