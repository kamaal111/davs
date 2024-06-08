import { createApi } from '@reduxjs/toolkit/query/react';
import type { z } from 'zod';

import METHODS from '@/common/http/methods';
import baseQuery from '@/common/api/base-query';
import type SignUpPayload from '../validators/sign-up-payload';

type SignUpUserResponse = { details: string };
type SignUpUserPayload = z.infer<typeof SignUpPayload>;

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
