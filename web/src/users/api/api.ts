import { createApi } from '@reduxjs/toolkit/query/react';

import METHODS from '@/common/http/methods';
import baseQuery from '@/common/api/base-query';

type SignUpUserResponse = { details: string };
type SignUpUserPayload = { username: string; password: string };

const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: baseQuery({ baseUrl: '/api/users' }),
  endpoints: builder => ({
    signUp: builder.mutation<SignUpUserResponse, SignUpUserPayload>({
      query: payload => ({ method: METHODS.POST, body: payload }),
    }),
  }),
});

export const { useSignUpMutation } = usersAPI;

export default usersAPI;
