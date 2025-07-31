import { getCookie } from './cookie';

export const getTokenForBaseURL = (baseURL: string): string | undefined => {
  let token: string | undefined;

  if (baseURL.includes(import.meta.env.VITE_PC_API_LOGS)) {
    token = getCookie('token_logs');
  } else if (baseURL.includes(import.meta.env.VITE_PC_API_APPS)) {
    token = getCookie('token_apps');
  } else if (baseURL.includes(import.meta.env.VITE_PC_API_TENANTS)) {
    token = getCookie('token_tenants');
  } else if (
    baseURL.includes(import.meta.env.VITE_PLATFORM_IDENTITY_SERVICE_IDs)
  ) {
    token = getCookie('token_user'); // Assuming this is the main token
  } else if (baseURL.includes(import.meta.env.VITE_PC_API_CORE)) {
    token = getCookie('token_core');
  }
  return token;
};

export const getTokenNameForBaseURL = (serviceID: string): string => {
  const tokenNameMap: Record<string, string> = {
    [import.meta.env.VITE_LOGS_SERVICE_IDs]: 'token_logs',
    [import.meta.env.VITE_APPLICATION_SERVICE_IDs]: 'token_apps',
    [import.meta.env.VITE_TENANTS_SERVICE_IDs]: 'token_tenants',
    [import.meta.env.VITE_PLATFORM_IDENTITY_SERVICE_IDs]: 'token_user',
    [import.meta.env.VITE_CORE_SERVICE_IDs]: 'token_core',
  };

  return tokenNameMap[serviceID]; // default fallback token name
};
