import { createApi } from '@reduxjs/toolkit/query/react';

import baseQuery from '@/common/api/base-query';
import signUpQuery from './queries/sign-up';
import loginQuery from './queries/login';

const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: baseQuery({ baseUrl: '/api/users' }),
  endpoints: builder => ({
    signUp: signUpQuery(builder),
    login: loginQuery(builder),
  }),
});

export default usersAPI;
