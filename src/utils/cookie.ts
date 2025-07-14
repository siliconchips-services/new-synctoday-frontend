import Cookies from 'js-cookie';

const COOKIE_PREFIX =
  import.meta.env.VITE_COOKIES_PREFIX?.replace(/"/g, '') || '';

const expiresTime = Number(import.meta.env.VITE_COOKIES_EXP) || 12;
const expiresInMs = expiresTime * 60 * 60 * 1000;
const DEFAULT_EXPIRY = new Date(Date.now() + expiresInMs);

export const setCookie = (
  key: string,
  value: string,
  options: Cookies.CookieAttributes = {},
) => {
  Cookies.set(`${COOKIE_PREFIX}${key}`, value, {
    expires: options.expires ?? DEFAULT_EXPIRY,
    path: '/', // accessible everywhere
    secure: true, // HTTPS only
    sameSite: 'strict', // stricter CSRF protection
    ...options,
  });
};

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(`${COOKIE_PREFIX}${key}`);
};

export const removeCookie = (key: string) => {
  Cookies.remove(`${COOKIE_PREFIX}${key}`);
};
