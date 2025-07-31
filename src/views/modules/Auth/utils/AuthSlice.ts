import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import API_URL from '@/config/ApiUrl';
import { CustomAxiosRequestConfig } from '@/config/InterfacesAndTypes';
import { AppThunk } from '@/store/app';
import { platform_identityApi, tenantidentityApi, usersApi } from '@/store/api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getCookie, setCookie } from '@/utils/cookie';

interface AuthState {
  appLoading: boolean;
  initialData: object | null;
  isLoading: boolean;
  userDetail: any;
  token: string | null;
  useName: string | null;
  permissionList: any | null;
  userImg: ArrayBuffer | null;
}
interface DecodedToken {
  TenantId: string;
  UserId: string;
  UserFirstName: string;
  UserLastName: string;
  UserEmailId: string;
  Scope: string;
  Role: string;
  sub: string;
  exp: number;
  iat: string;
  iss: string;
  aud: string;
  jti: string;
}

const TOKEN_KEY = 'token';
const expiresTime = Number(import.meta.env.VITE_COOKIES_EXP) || 12;
const expiresInMs = expiresTime * 60 * 60 * 1000;
const expiresDate = new Date(Date.now() + expiresInMs);

const initialState = {
  appLoading: true,
  initialData: {},
  isLoading: false,
  userDetail: null,
  token: null,
  useName: '',
  userImg: null,
  permissionList: [],
} as AuthState;

const AuthSlice = createSlice({
  name: 'AUTH',
  initialState,
  reducers: {
    setPermissionList: (state, action: PayloadAction<boolean>) => {
      const permissionList = action.payload ? action.payload : [];
      state.permissionList = permissionList;
      setCookie('permission', permissionList.toString(), {
        expires: expiresDate,
      });
    },
    setUserImg: (state, action: PayloadAction<ArrayBuffer>) => {
      state.userImg = action.payload;
    },
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.appLoading = action.payload;
    },
    setUserToken: (state, action: PayloadAction<string | null>) => {
      saveToken(action.payload);
      state.token = action.payload;
    },
    setUserDetail: (state, action: PayloadAction<any>) => {
      state.userDetail = action.payload;
    },
    resetAuthStore: () => {
      return initialState; // Reset the state to the initial state
    },
    success: (state, action: PayloadAction<any>) => {
      setCookie(TOKEN_KEY, action.payload?.data?.token, {
        expires: expiresDate,
      }); // in setUserToken()
      decodeToken();
    },
    failure: (state) => {
      state.isLoading = false;
    },
    setUserName: (state, action: PayloadAction<any>) => {
      state.useName = action?.payload ? action?.payload : '';
    },
  },
});

export const {
  success,
  failure,
  resetAuthStore,
  setAppLoading,
  setUserDetail,
  setUserToken,
  setUserName,
  setPermissionList,
  setUserImg,
} = AuthSlice.actions;

export const saveToken =
  (token: string): AppThunk<any> =>
  async (dispatch) => {
    try {
      const decoded: any = decodeToken(token);

      const userDetail = JSON.stringify(decoded);

      dispatch(setPermissionList(decoded?.Permission || []));

      setCookie(TOKEN_KEY, token, { expires: expiresDate });
      setCookie('userDetails', userDetail, {
        expires: expiresDate,
      });
      setCookie('userID', decoded?.UserId, { expires: expiresDate });
      setCookie('tenantID', decoded?.TenantId, { expires: expiresDate });
      getUserPreference(decoded?.UserId, decoded?.TenantId, userToken);
      setCookie(
        'userFullName',
        `${decoded?.UserFirstName || ''} ${decoded?.UserLastName || ''}`,
        { expires: expiresDate },
      );
    } catch (e) {
      console.error(
        'Failed to decode token. Falling back to 12-hour expiry.',
        e,
      );
      const fallbackDate = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours
      setCookie(TOKEN_KEY, token, { expires: fallbackDate });
    }
  };

export const getToken = (): string | undefined => {
  return getCookie(TOKEN_KEY);
};

export const decodeToken = (tokenKey?: string): DecodedToken | null => {
  const token = tokenKey || getCookie(TOKEN_KEY);
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (e) {
    console.error('Invalid token', e);
    return null;
  }
};
// const COOKIE_PREFIX =
//   import.meta.env.VITE_COOKIES_PREFIX?.replace(/"/g, '') || '';

export const removeToken = (): void => {
  const allCookies = Cookies.get();

  Object.keys(allCookies).forEach((cookieName) => {
    Cookies.remove(cookieName);
  });
  localStorage.clear();
};

const userToken = getCookie('token');

export const getAppDetails =
  (action: any): AppThunk<any> =>
  async () => {
    try {
      const config: CustomAxiosRequestConfig = {
        showToast: false,
        notAddLog: false,
      };
      const response = await tenantidentityApi.post(
        API_URL.AUTH.TENANT_APP_SUMMARY,
        action,
        config,
      );

      return response;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const doLogin =
  (action: any): AppThunk<any> =>
  async (dispatch) => {
    try {
      const config: CustomAxiosRequestConfig = {
        showToast: true,
        notAddLog: false,
      };
      const response = await usersApi.post(API_URL.AUTH.LOGIN, action, config);
      if (response?.data?.token) {
        dispatch(setUserToken(response.data.token));
        dispatch(saveToken(response.data.token));
      }
      dispatch(success(response));
      return response;
    } catch (error: any) {
      dispatch(failure());
      throw error;
    }
  };

export const appLogin =
  (apiID: string): AppThunk<any> =>
  async () => {
    try {
      const config: CustomAxiosRequestConfig = {
        showToast: false,
        notAddLog: false,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken ?? getCookie('token')}`,
        },
      };
      const payload = {
        appId: import.meta.env.VITE_PLATFORM_CONSOLE_IDs,
        secret: import.meta.env.VITE_PLATFORM_CONSOLE_KEY,
        scope: apiID,
      };
      const response = await platform_identityApi.post(
        API_URL.PLATFORM_IDENTITY.APP_LOGIN,
        payload,
        config,
      );

      const returnDetails = {
        res: {
          ...response?.data,
        },
        expiresDate: expiresDate,
      };

      return returnDetails;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const getUserPreference =
  (id: string, tenantID: string, token: string): AppThunk<any> =>
  async (dispatch) => {
    try {
      const response = await usersApi.get(
        `${API_URL.AUTH.USER_PREFERENCE}?userId=${id}&tenantId=${tenantID}`,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const themeCode = response?.data?.data?.themeCode;

      const returnDetails = {
        res: {
          ...response?.data?.data,
          themeCode: themeCode,
        },
        expiresDate: expiresDate,
      };
      dispatch(getUserProfileImage(id));
      return returnDetails;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

// const config: CustomAxiosRequestConfig = {
//   showToast: true,
//   notAddLog: false,
//   responseType: 'arraybuffer',
//   headers: {
//     accept: 'application/json',
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${userToken}`,
//   },
// };
export const getUserProfileImage =
  (id: string): AppThunk<any> =>
  async (dispatch) => {
    try {
      const tenantId = getCookie('tenantID');
      const response = await usersApi.get(
        `${API_URL.USERS.USER_PROFILE_IMAGE}?userId=${id}&tenantId=${tenantId}`,
        {
          showToast: true,
          notAddLog: false,
          responseType: 'arraybuffer',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken ?? getCookie('token')}`,
          },
        } as CustomAxiosRequestConfig,
      );
      const returnDetails = response?.data;
      dispatch(setUserImg(returnDetails));
      return returnDetails;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export default AuthSlice.reducer;
