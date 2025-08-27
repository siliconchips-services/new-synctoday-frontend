// src/store/dropdowns/usersDropdownSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchDropdownData } from './helpers';
import API_URL from '@/config/ApiUrl';
import { usersApi } from '../api';
import Cookies from 'js-cookie';

interface DropdownState {
  list: any[];
}

interface UserItem {
  firstName: string;
  lastName: string;
  userId: string;
  active: boolean;
}

const initialState: DropdownState = {
  list: [],
};

const userToken = Cookies.get('token_user');
const headers = {
  accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${userToken}`,
};

const usersDropdownSlice = createSlice({
  name: 'usersDropdown',
  initialState,
  reducers: {
    setUsersList: (state, action: PayloadAction<any[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setUsersList } = usersDropdownSlice.actions;

export const getUsersDropdown = (payload?: any) =>
  fetchDropdownData<UserItem>({
    api: usersApi,
    url: API_URL.USERS.LIST,
    payload,
    headers: headers,
    formatter: (item) => ({
      label: item.firstName + ' ' + item.lastName + ' (' + item.userId + ')',
      value: item.userId,
      active: item.active,
    }),
    setList: setUsersList,
  });

export default usersDropdownSlice.reducer;
