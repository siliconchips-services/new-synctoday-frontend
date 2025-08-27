// src/store/dropdowns/tenantsDropdownSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDropdownData } from './helpers';
import API_URL from '@/config/ApiUrl';
import { tenantsApi } from '../api';
import Cookies from 'js-cookie';

interface DropdownState {
  list: any[];
}

interface TenantItem {
  displayName: string;
  tenantId: string;
  active: boolean;
}

const initialState: DropdownState = {
  list: [],
};

const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${Cookies.get('token_tenants')}`,
};

const tenantsDropdownSlice = createSlice({
  name: 'tenantsDropdown',
  initialState,
  reducers: {
    setTenantsList: (state, action: PayloadAction<any[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setTenantsList } = tenantsDropdownSlice.actions;

export const getTenantsDropdown = (payload?: any) =>
  fetchDropdownData<TenantItem>({
    api: tenantsApi,
    url: API_URL.TENANT.LIST,
    payload,
    headers: headers,
    formatter: (item) => ({
      label: item.displayName,
      value: item.tenantId,
      active: item.active,
    }),
    setList: setTenantsList,
  });

export default tenantsDropdownSlice.reducer;
