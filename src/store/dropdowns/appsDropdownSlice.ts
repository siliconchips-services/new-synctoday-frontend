// src/store/dropdowns/appsDropdownSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDropdownData } from './helpers';
import API_URL from '@/config/ApiUrl';
import { appsApi } from '../api';
import Cookies from 'js-cookie';

interface DropdownState {
  list: any[];
}

interface AppItem {
  displayName: string;
  appId: string;
  active: boolean;
}

const initialState: DropdownState = {
  list: [],
};

const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Cookies.get('token_apps')}`,
};

const appsDropdownSlice = createSlice({
  name: 'appsDropdown',
  initialState,
  reducers: {
    setAppsList: (state, action: PayloadAction<any[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setAppsList } = appsDropdownSlice.actions;

export const getAppsDropdown = (payload?: any) =>
  fetchDropdownData<AppItem>({
    api: appsApi,
    url: API_URL.APPS.LIST,
    payload,
    headers: headers,
    formatter: (item) => ({
      label: item.displayName,
      value: item.appId,
      active: item.active,
    }),
    setList: setAppsList,
  });

export default appsDropdownSlice.reducer;
