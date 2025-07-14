const API_URL = {
  AUTH: {
    LOGIN: `tenantidentity/userlogin`,
    APP_LOGIN: `tenantidentity/userapplogin`,
    USER_PREFERENCE: `tenantidentity/userpreference`,
  },

  USERS: {
    ADD: 'tenantidentity/user',
    EDIT: 'tenantidentity/user',
    LIST: 'tenantidentity/users',
    DETAILS: 'tenantidentity/user/summary',
    USER_PROFILE_IMAGE: `tenantidentity/user/profile-image`,

    PREFERENCE: 'tenantidentity/userpreference',
    UPDATE_PREFERENCE: 'tenantidentity/userpreference',

    CHANGE_PASSWORD: 'tenantidentity/users/reset-password',
    GENERATE_PASSWORD: 'tenantidentity/users/generate-password',
  },
};

export default API_URL;
