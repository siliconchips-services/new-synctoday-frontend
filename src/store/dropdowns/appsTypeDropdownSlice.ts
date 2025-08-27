import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDropdownData } from './helpers';
import Cookies from 'js-cookie';
import API_URL from '@/config/ApiUrl';
import { appsApi } from '../api';
interface DropdownState {
  list: any[];
}

interface AppItem {
  txt: string;
  id: string;
}

const initialState: DropdownState = {
  list: [],
};

const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Cookies.get('token_apps')}`,
};

const appsTypeDropdownSlice = createSlice({
  name: 'appsTypeDropdown',
  initialState,
  reducers: {
    setAppsTypeList: (state, action: PayloadAction<any[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setAppsTypeList } = appsTypeDropdownSlice.actions;

export const getAppsTypeDropdown = (payload?: any) =>
  fetchDropdownData<AppItem>({
    api: appsApi,
    url: API_URL.APPS_TYPE.LIST,
    payload,
    headers: headers,
    formatter: (item) => ({
      label: item.txt,
      value: item.id,
    }),
    setList: setAppsTypeList,
  });

export default appsTypeDropdownSlice.reducer;
