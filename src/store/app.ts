import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import AuthSlice from '@/views/modules/Auth/utils/AuthSlice';

// import appsDropdownSlice from './dropdowns/appsDropdownSlice';
// import tenantsDropdownSlice from './dropdowns/tenantsDropdownSlice';
// import usersDropdownSlice from './dropdowns/usersDropdownSlice';
import UsersSlice from '@/views/modules/Users/utils/usersSlice';

export const store = configureStore({
  reducer: {
    AUTH: AuthSlice,

    // APPS_DROPDOWN: appsDropdownSlice,
    // TENANTS_DROPDOWN: tenantsDropdownSlice,
    // USERS_DROPDOWN: usersDropdownSlice,

    USERS: UsersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<any>
>;

// export default store;
