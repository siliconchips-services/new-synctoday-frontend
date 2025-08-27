import { AppDispatch } from '@/store/app';
import { getCookie } from '@/utils/cookie';
import { appLogin } from './dashboardSlice';

interface OpenAppOptions {
  // apiID: string;
  appUrl: string; // e.g., "http://localhost:5174/login"
  dispatch: AppDispatch;
  setIsLoading: (loading: boolean) => void;
  target?: '_blank' | '_self';
}

export const openExternalReactApp = async ({
  // apiID,
  appUrl,
  dispatch,
  setIsLoading,
  target = '_blank',
}: OpenAppOptions) => {
  try {
    setIsLoading(true);

    const tenantID = getCookie('tenantID');
    const userToken = getCookie('token');
    const apiID =
      import.meta.env.VITE_TENANT_IDENTITY_SERVICE_IDs ||
      'c35d37a4-b5f6-486d-8f96-a57ec112fb0d';

    // 1. Call backend through Redux action
    const loginResponse: any = await dispatch(
      appLogin(apiID, tenantID, userToken),
    );

    const token = loginResponse?.token || null;
    if (!token) throw new Error('No token received');

    // 2. Open new tab/window
    const popup = window.open(`${appUrl}/?token=${token}`, target);

    // Retry until popup is ready
    const timer = setInterval(() => {
      if (!popup || popup.closed) clearInterval(timer);
      try {
        // sendToken();
        clearInterval(timer);
      } catch {
        // wait until popup is ready
      }
    }, 200);
  } catch (err) {
    console.error('Error opening external app:', err);
  } finally {
    setIsLoading(false);
  }
};
