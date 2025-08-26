import axios, { AxiosRequestConfig } from 'axios';
import { Notification } from '@/config/globalNotification';
import { logActivity } from '@/utils/logUtils';
// import Cookies from 'js-cookie';
import { removeToken } from '@/views/modules/Auth/utils/AuthSlice';
import { getTokenForBaseURL } from '@/utils/tokenResolver';
import { v4 as uuidv4 } from 'uuid';

interface CustomAxiosConfig extends AxiosRequestConfig {
  showToast?: boolean;
  notAddLog?: boolean;
}

// Multiple base URLs
const PC_BASE_URLS = {
  users: import.meta.env.VITE_PC_API_USERS,
  tenantidentity: import.meta.env.VITE_PC_API_TENANT_IDENTITY,
  core: import.meta.env.VITE_PC_API_CORE,
  logs: import.meta.env.VITE_PC_API_LOGS,
  apps: import.meta.env.VITE_PC_API_APPS,
  tenants: import.meta.env.VITE_PC_API_TENANTS,
  platform_identity: import.meta.env.VITE_PC_API_PLATFORM_IDENTITY,
};

// Generic function to get an Axios instance
const createApiInstance = (baseURL: string) => {
  const tenantId = import.meta.env.VITE_X_TENANT_ID;
  const appId = import.meta.env.VITE_X_APP_ID;
  const traceId = uuidv4();

  const instance = axios.create({
    baseURL,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      'x-trace-id': traceId,
      'x-tenant-id': tenantId,
      'x-app-id': appId,
    },
    timeout: 60000,
  });

  instance.interceptors.request.use((config) => {
    const token = getTokenForBaseURL(baseURL);
    // console.log('config.headers', config.data);

    if (config?.data?.headers) {
      console.log('config.data.headers', config?.data?.headers);
      if (config?.data?.headers?.['x-app-id']) {
        (config.headers as any).set(
          'x-app-id',
          config.data.headers['x-app-id'],
        );
      }
      if (token) {
        (config.headers as any).set('Authorization', `Bearer ${token}`);
      }
    } else if (
      config.headers &&
      typeof (config.headers as any).set === 'function'
    ) {
      if (token) {
        (config.headers as any).set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    async (response) => {
      const config = response.config as CustomAxiosConfig;

      const responseData = response?.data;

      if (Array.isArray(responseData) && responseData.length === 0) {
        await logActivity({
          level: 'Warning',
          className: 'Axios',
          method: response.config?.url || 'Unknown URL',
          message: `No data found for: ${response.config.method?.toUpperCase()} ${response.config.url} - Message: ${response.data?.message ?? 'No message found.'} - Payload: ${config.data}`,
        });
      }
      if (!config.notAddLog) {
        await logActivity({
          level: 'Information',
          className: 'Axios_API_Call',
          method: response.config?.url || 'Unknown URL',
          message: `API Success: ${response.config.method?.toUpperCase()} ${response.config.url} - Message: ${response.data?.message} - Payload: ${config.data}`,
        });
      }

      if (response.data?.message && config?.showToast) {
        Notification.success({ message: response.data?.message });
      }

      if (response?.status === 401) {
        Notification.error({ message: 'Session expired. Please login again.' });
        await logActivity({
          level: 'Warning',
          className: 'Axios',
          method: response.config?.url || 'Unknown URL',
          message: `Session expired: ${response.config.method?.toUpperCase()} ${response.config.url} - Payload: ${config.data}`,
        });

        removeToken();
        window.location.href = '/';
      } else if (response?.status === 429 || response?.status === 500) {
        Notification.error({ message: response.data?.message });

        const messageStatus =
          response?.status === 429
            ? 'Too Many Requests'
            : response?.status === 500
              ? 'Internal Server Error'
              : 'Unknown Error';

        await logActivity({
          level: 'Warning',
          className: 'Axios',
          method: response.config?.url || 'Unknown URL',
          message: `${messageStatus}: ${response.config.method?.toUpperCase()} ${response.config.url} - Message: ${response.data?.message} - Payload: ${config.data}`,
        });
        removeToken();
      }

      return response;
    },
    async (error) => {
      const config = error?.config as CustomAxiosConfig;
      const method = error?.config?.method?.toUpperCase();
      const url = error?.config?.baseURL + '/' + error?.config?.url;
      const status = error?.response?.status || 0;

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong, please try again or contact the administrator.';

      Notification.error({ message });

      if (!config.notAddLog) {
        await logActivity({
          level: 'Error',
          className: 'API Call',
          method: `${method} ${url}`,
          message: `Message:${message} - Payload: ${config.data}`,
          errorDetail: {
            stackTrace: error.stack || '',
            exceptionType: `HTTP_${status}`,
          },
        });
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

// Export instances
const usersApi = createApiInstance(PC_BASE_URLS.users);
const tenantidentityApi = createApiInstance(PC_BASE_URLS.tenantidentity);
const coreApi = createApiInstance(PC_BASE_URLS.core);
const logsApi = createApiInstance(PC_BASE_URLS.logs);
const appsApi = createApiInstance(PC_BASE_URLS.apps);
const tenantsApi = createApiInstance(PC_BASE_URLS.tenants);
const platform_identityApi = createApiInstance(PC_BASE_URLS.platform_identity);

export {
  PC_BASE_URLS,
  usersApi,
  tenantidentityApi,
  coreApi,
  logsApi,
  appsApi,
  tenantsApi,
  platform_identityApi,
};
