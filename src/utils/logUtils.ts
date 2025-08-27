import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { getDeviceInfo } from './deviceInfo';

const userDetails = Cookies.get('userDetails');
const userDetailsJson = userDetails ? JSON.parse(userDetails) : {};
const appId = import.meta.env.VITE_X_APP_ID || '';
const tenantId = import.meta.env.VITE_X_TENANT_ID || '';

let getIpAddress = '';

const getIp = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    getIpAddress = data.ip;
    return data.ip || '';
  } catch {
    return '';
  }
};

const getTimeStampUTC = (): string => {
  return new Date().toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
};

export type LogLevel = 'Information' | 'Warning' | 'Error';

interface LogParams {
  level: LogLevel;
  className: string;
  method: string;
  message: string;
  userId?: string;
  userType?: string;
  userName?: string;
  errorDetail?: {
    stackTrace: string;
    exceptionType: string;
  } | null;
}

export const logActivity = async ({
  level,
  className,
  method,
  message,
  userType = 'user',
  userId = userDetailsJson?.UserId ?? '',
  userName = `${userDetailsJson?.UserFirstName || ''} ${userDetailsJson?.UserLastName || ''}`,
  errorDetail = null,
}: LogParams): Promise<void> => {
  // const traceId = `${uuidv4().split('-')[0]}:${Math.floor(
  //   Math.random() * 100000000,
  // )
  //   .toString()
  //   .padStart(8, '0')}`;
  const traceId = uuidv4(); // ✅ Standard UUID format

  const ipAddress = getIpAddress !== '' ? getIpAddress : await getIp();

  const os = getDeviceInfo().os;
  const browser = getDeviceInfo().browser;

  const payload = {
    level,
    class: className,
    method,
    message,
    appId,
    // appName,
    tenantId,
    userId,
    userType,
    userName,
    traceId,
    webBrowser: browser,
    machineName: os,
    errorDetail,
    ipAddress,
    // locationDetail: {
    //   ipAddress,
    //   city: '',
    //   postalCode: '',
    //   region: '',
    //   country: '',
    //   serviceProvider: '',
    // },
    timeStampUTC: getTimeStampUTC(),
  };

  try {
    const { store } = await import('@/store/app');
    const { addLogs } = await import('./logsSlice');
    await store.dispatch(addLogs(payload));
  } catch (err) {
    console.warn('Log API failed', err);
  }
};
