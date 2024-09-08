import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { Session } from '@/types';

type State = {
  session?: Session;
};

const initialState: State = {};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Session>) => {
      state.session = action.payload;
    },
  },
});

export default usersSlice;
