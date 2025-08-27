import Cookies from 'js-cookie';

const COOKIE_PREFIX =
  import.meta.env.VITE_COOKIES_PREFIX?.replace(/"/g, '') || '';

const expiresTime = Number(import.meta.env.VITE_COOKIES_EXP) || 12;
const expiresInMs = expiresTime * 60 * 60 * 1000;
const DEFAULT_EXPIRY = new Date(Date.now() + expiresInMs);

// Figure out the correct domain scope
export const getCookieDomain = () => {
  if (import.meta.env.MODE === 'development') {
    console.log('Dev mode - no domain for cookies (scoped to localhost)');
    return undefined; // ✅ avoid "localhost:port" bug
  }

  // Share cookies only between ST and MC (subdomains of platform)
  if (
    window.location.hostname.endsWith('.platform.siliconchips-syncapps.com')
  ) {
    return '.platform.siliconchips-syncapps.com'; // ✅ covers all subdomains
  }

  // For PC (root app), restrict to its domain
  if (
    window.location.hostname === 'platformconsole.siliconchips-syncapps.com'
  ) {
    return 'platformconsole.siliconchips-syncapps.com'; // explicit but optional
  }

  return undefined;
};

export const setCookie = (
  key: string,
  value: string,
  options: Cookies.CookieAttributes = {},
) => {
  Cookies.set(`${COOKIE_PREFIX}${key}`, value, {
    expires: options.expires ?? DEFAULT_EXPIRY,
    path: '/', // accessible everywhere
    secure: true, // HTTPS only
    sameSite: 'Strict',
    domain: getCookieDomain(),
    ...options,
  });
};

export const getCookie = (key: string): string | undefined => {
  return Cookies.get(`${COOKIE_PREFIX}${key}`);
};

export const removeCookie = (key: string) => {
  Cookies.remove(`${COOKIE_PREFIX}${key}`, {
    path: '/',
    domain: getCookieDomain(),
  });
};
