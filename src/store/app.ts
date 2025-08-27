import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import AuthSlice from '@/views/modules/Auth/utils/AuthSlice';
import DashboardSlice from '@/views/modules/Dashboard/utils/dashboardSlice';
import UsersSlice from '@/views/modules/Users/utils/usersSlice';

export const store = configureStore({
  reducer: {
    AUTH: AuthSlice,
    DASHBOARD: DashboardSlice,
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
