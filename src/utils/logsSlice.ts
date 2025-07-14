import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logsApi } from '@/store/api';
import API_URL from '@/config/ApiUrl';
import { AppThunk } from '@/store/app';
import { CustomAxiosRequestConfig } from '@/config/InterfacesAndTypes';

interface LogsState {
  logList: any | null;
  appList: any | null;
  isLoading: boolean;
}

const initialState = {
  logList: [],
  appList: [],
} as LogsState;

const LogsSlice = createSlice({
  name: 'Logs',
  initialState,
  reducers: {
    setLogList: (state, action: PayloadAction<any>) => {
      state.logList = action?.payload?.data ? action?.payload?.data : [];
    },
    setAppList: (state, action: PayloadAction<any>) => {
      state.appList = action?.payload ? action?.payload : [];
    },
  },
});

export const { setLogList, setAppList } = LogsSlice.actions;

export const addLogs =
  (action: any): AppThunk<any> =>
  async () => {
    try {
      const response = await logsApi.post(API_URL.LOGS.ADD, action, {
        headers: {
          'x-trace-id': action?.traceId || '',
          'x-api-key': 'T#qv2*ZWgL&nRs89!bKYx^7Md@AP3jVTzE%uNhC$',
        },
        notAddLog: true,
      } as CustomAxiosRequestConfig);
      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const getLogList =
  (action: any): AppThunk<any> =>
  async (dispatch) => {
    try {
      const response = await logsApi.post(API_URL.LOGS.LIST, action, {
        headers: {
          'x-api-key': `@eL9Xv!rTZ#fM5$GqJdY^6PnUbKtA2&HwCxWs38%`,
        },
      } as CustomAxiosRequestConfig);
      dispatch(setLogList(response?.data));
      return response.data;
    } catch (error: any) {
      dispatch(setLogList([]));
      throw error;
    }
  };

export const deleteLogList =
  (action: any): AppThunk<Promise<any>> =>
  async () => {
    try {
      const response = await logsApi.delete(API_URL.LOGS.DELETE, {
        data: action,
        showToast: true,
        headers: {
          'x-api-key': '$M3gF!z9^Lw@c#XAq7pJ2%UdYT&eN0KrV*bHsZ+1i',
        },
      } as CustomAxiosRequestConfig);
      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export const exportLogList =
  (action: any): AppThunk<any> =>
  async () => {
    try {
      const response = await logsApi.post(API_URL.LOGS.EXPORT, action, {
        showToast: true,
        headers: {
          'x-api-key': 'HGqv]v@jG&gI@hXpKxD+U^qkKbUP2$[rA%kKb',
        },
      } as CustomAxiosRequestConfig);
      return response.data;
    } catch (error: any) {
      console.error('Error: ', error);
      throw new Error('Error: ');
    }
  };

export default LogsSlice.reducer;
