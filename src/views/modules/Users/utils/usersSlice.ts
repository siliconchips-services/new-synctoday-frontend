import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { coreApi, usersApi } from '@/store/api';
import API_URL from '@/config/ApiUrl';
import { AppThunk } from '@/store/app';
import { CustomAxiosRequestConfig } from '@/config/InterfacesAndTypes';
import { getUserProfileImage } from '../../Auth/utils/AuthSlice';
import { getCookie } from '@/utils/cookie';

interface UsersState {
  usersList: any | null;
  scopeRolesList: any | null;
  assignRolesList: any | null;
  isLoading: boolean;
}

const initialState = {
  usersList: [],
  scopeRolesList: [],
  assignRolesList: [],
  isLoading: false,
} as UsersState;

const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    setUsersList: (state, action: PayloadAction<any>) => {
      state.usersList = action?.payload?.data ? action?.payload?.data : [];
    },
    setScopeRolesList: (state, action: PayloadAction<any>) => {
      state.scopeRolesList = action?.payload?.data ? action?.payload?.data : [];
      state.isLoading = false;
    },
    setAssignRolesList: (state, action: PayloadAction<any>) => {
      state.assignRolesList = action?.payload?.data
        ? action?.payload?.data
        : [];
      state.isLoading = false;
    },
    setIsLoading: (state, action: PayloadAction<any>) => {
      state.isLoading = action?.payload;
    },
  },
});

export const {
  setUsersList,
  setScopeRolesList,
  setAssignRolesList,
  setIsLoading,
} = UsersSlice.actions;

const expiresTime = import.meta.env.VITE_COOKIES_EXP || 12;
const expiresInMs = expiresTime * 60 * 60 * 1000;
const expiresDate = new Date(Date.now() + expiresInMs);

const userToken = getCookie('token');
const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${userToken ?? getCookie('token')}`,
};

const config: CustomAxiosRequestConfig = {
  showToast: true,
  notAddLog: false,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userToken ?? getCookie('token')}`,
  },
};

const formDataConfig: CustomAxiosRequestConfig = {
  showToast: true,
  notAddLog: false,
  headers: {
    accept: 'text/plain',
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${getCookie('token')}`,
  },
};

export const getUsersList =
  (action: any): AppThunk<any> =>
  async (dispatch) => {
    try {
      const response = await usersApi.post(API_URL.USERS.LIST, action, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken ?? getCookie('token')}`,
        },
      });
      dispatch(setUsersList(response?.data));
      return response.data;
    } catch (error: any) {
      dispatch(setUsersList([]));
      throw error;
    }
  };

export const getUserDetails =
  (action: any): AppThunk<any> =>
  async (dispatch) => {
    try {
      const response = await usersApi.get(
        `${API_URL.USERS.DETAILS}?userId=${action}`,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken ?? getCookie('token')}`,
          },
        },
      );
      dispatch(getUserProfileImage(action));
      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const getUserPreference =
  (userId: string, tenantId: string): AppThunk<any> =>
  async (dispatch) => {
    try {
      const response = await usersApi.get(
        `${API_URL.AUTH.USER_PREFERENCE}?userId=${userId}&tenantId=${tenantId}`,
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken ?? getCookie('token')}`,
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
      dispatch(getUserProfileImage(userId));
      return returnDetails;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const editUserPreference =
  (action: any): AppThunk<any> =>
  async () => {
    try {
      const response = await usersApi.put(
        API_URL.USERS.UPDATE_PREFERENCE,
        action,
        config,
      );

      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const addNewUser =
  (action: any): AppThunk<any> =>
  async () => {
    try {
      const response = await usersApi.post(
        API_URL.USERS.ADD,
        action,
        formDataConfig,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const editNewUser =
  (id: string, action: any): AppThunk<any> =>
  async (dispatch) => {
    try {
      const response = await usersApi.put(
        `${API_URL.USERS.EDIT}`,
        action,
        formDataConfig,
      );
      const userId = getCookie('userID');
      dispatch(getUserProfileImage(userId));
      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const getLanguageDD = (): AppThunk<any> => async () => {
  try {
    const response = await coreApi.get(API_URL.CORE.LANGUAGES.DD_LIST, {
      headers: headers,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error: ', error);
    throw new Error('Error: ');
  }
};
export const getTimeZoneDD = (): AppThunk<any> => async () => {
  try {
    const response = await coreApi.get(API_URL.CORE.TIMEZONES.LIST, {
      headers: headers,
    });
    const configJson = response?.data?.data?.configJson
      ? JSON.parse(response?.data?.data?.configJson)
      : null;
    return configJson;
  } catch (error: any) {
    console.error('Error: ', error);
    throw new Error('Error: ');
  }
};
export const getDateFormatsDD =
  (action: string): AppThunk<any> =>
  async () => {
    try {
      const response = await coreApi.get(
        `${API_URL.CORE.TIMEZONES.DATE_FORMATE}?timeZoneCode=${action}`,
        {
          headers: headers,
        },
      );

      return response?.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };
export const getTimeFormatsDD =
  (action: string): AppThunk<any> =>
  async () => {
    try {
      const response = await coreApi.get(
        `${API_URL.CORE.TIMEZONES.TIME_FORMATE}?timeZoneCode=${action}`,
        {
          headers: headers,
        },
      );

      return response?.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const changeUserPassword =
  (action: any): AppThunk<any> =>
  async () => {
    try {
      const response = await usersApi.post(
        API_URL.USERS.CHANGE_PASSWORD,
        action,
        config,
      );
      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const generatePassword = (): AppThunk<any> => async () => {
  try {
    const userToken = getCookie('token');
    const response = await usersApi.get(API_URL.USERS.GENERATE_PASSWORD, {
      headers: {
        accept: 'text/plain',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error: ', error);
    throw new Error('Error: ');
  }
};

export default UsersSlice.reducer;
