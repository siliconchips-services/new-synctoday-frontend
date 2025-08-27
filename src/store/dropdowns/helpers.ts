import { AppThunk } from '@/store/app';
import { Action } from '@reduxjs/toolkit';

interface FetchDropdownParams<T> {
  api: any;
  method?: 'get' | 'post';
  url: string;
  payload?: any;
  headers?: any;
  formatter: (item: T) => {
    label: string;
    value: string | number;
    [key: string]: any;
  };
  setList: (data: any) => Action;
}

export const fetchDropdownData = <T>({
  api,
  method = 'post',
  url,
  payload,
  headers,
  formatter,
  setList,
}: FetchDropdownParams<T>): AppThunk => {
  return async (dispatch) => {
    try {
      let response;
      if (method === 'get') {
        response = await api.get(
          url,
          { params: payload ?? {} },
          {
            headers: headers,
            showToast: false,
          },
        );
      } else {
        response = await api.post(url, payload ?? {}, {
          headers: headers,
          showToast: false,
        });
      }

      const formatted = response?.data?.data.map((item: T) => formatter(item));
      dispatch(setList(formatted));
    } catch (error) {
      console.error('Dropdown fetch failed:', error);
      dispatch(setList([]));
    }
  };
};
