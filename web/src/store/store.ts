import { configureStore } from '@reduxjs/toolkit';

import usersSlice from '@/users/store';
import usersAPI from '@/users/api';

const store = configureStore({
  reducer: {
    [usersSlice.name]: usersSlice.reducer,
    [usersAPI.reducerPath]: usersAPI.reducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(usersAPI.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
