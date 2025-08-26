import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { tenantidentityApi, usersApi } from '@/store/api';
import API_URL from '@/config/ApiUrl';
import { AppThunk } from '@/store/app';
import { CustomAxiosRequestConfig } from '@/config/InterfacesAndTypes';
import { getCookie } from '@/utils/cookie';

interface DashboardState {
  appList: any | null;
}

const initialState = {
  appList: [],
} as DashboardState;

const DashboardSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    setAppList: (state, action: PayloadAction<any>) => {
      state.appList = action?.payload?.data ? action?.payload?.data : [];
    },
  },
});

export const { setAppList } = DashboardSlice.actions;

const userToken = getCookie('token');

export const fetchAppsList =
  (tenantId: string, userId: string): AppThunk =>
  async () => {
    try {
      const response = await usersApi.get(
        `${API_URL.USERS.APP_LIST}?tenantId=${tenantId}&userId=${userId}`,
        {
          showToast: true,
          notAddLog: false,
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken ?? getCookie('token')}`,
          },
        } as CustomAxiosRequestConfig,
      );

      return response.data?.data;
    } catch (error) {
      console.error('Failed to fetch app list:', error);
    }
  };

export const appLogin =
  (apiID: string, tenantID: string, userToken: string): AppThunk<any> =>
  async () => {
    try {
      const response = await tenantidentityApi.post(
        `${API_URL.AUTH.APP_LOGIN}?token=${userToken}`,
        {
          showToast: false,
          notAddLog: false,
          headers: {
            accept: '*/*',
            'Content-Type': 'sendToken',
            'x-tenant-id': tenantID,
            'x-app-id': apiID,
          },
        } as CustomAxiosRequestConfig,
      );

      return response?.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export default DashboardSlice.reducer;
