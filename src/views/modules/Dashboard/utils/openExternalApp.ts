import { AppDispatch } from '@/store/app';
import { getCookie } from '@/utils/cookie';
import { appLogin } from './dashboardSlice';

interface OpenAppOptions {
  appId: string; // must always be passed
  appUrl: string; // must always be passed
  dispatch: AppDispatch;
  setIsLoading: (loading: boolean) => void;
  target?: '_blank' | '_self';
}

interface AppLoginResponse {
  token: string;
}

export const openExternalApp = async ({
  appId,
  appUrl,
  dispatch,
  setIsLoading,
  target = '_blank',
}: OpenAppOptions) => {
  try {
    setIsLoading(true);

    const tenantID = getCookie('tenantID');
    const userToken = getCookie('token');

    if (!tenantID || !userToken) {
      throw new Error('Missing tenantID or user token in cookies');
    }

    // 1. Call backend through Redux action
    const loginResponse = (await dispatch(
      appLogin(appId, tenantID, userToken),
    )) as unknown as AppLoginResponse;

    const userAppToken = loginResponse?.token;
    if (!userAppToken) throw new Error('No token received from appLogin');

    console.log('userAppToken', userAppToken);

    // 2. Build form for POST redirect
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = appUrl;
    form.target = target;

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'token';
    input.value = userAppToken;
    form.appendChild(input);

    document.body.appendChild(form);

    form.submit();

    // cleanup after short delay (avoid cancel in some browsers)
    setTimeout(() => form.remove(), 500);
  } catch (err) {
    console.error('Error opening external app:', err);
  } finally {
    setIsLoading(false);
  }
};
