import { UAParser } from 'ua-parser-js';

export interface DeviceInfo {
  os: string;
  browser: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  const parser = new UAParser();
  const result = parser.getResult();

  return {
    os: result.os.name || 'Unknown OS',
    browser: result.browser.name || 'Unknown Browser',
  };
};
