import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { usersApi } from '@/store/api';
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
const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${userToken ?? getCookie('token')}`,
};

const config: CustomAxiosRequestConfig = {
  showToast: true,
  notAddLog: false,
  headers: headers,
};

export const fetchAppsList =
  (tenantId: string, userId: string): AppThunk =>
  async () => {
    try {
      const response = await usersApi.get(
        `${API_URL.USERS.APP_LIST}?tenantId=${tenantId}&userId=${userId}`,
        config,
      );

      return response.data?.data;
    } catch (error) {
      console.error('Failed to fetch app list:', error);
    }
  };

export default DashboardSlice.reducer;
