import type { z } from 'zod';

import type { EndpointBuilder } from '../types';
import METHODS from '@/common/http/methods';
import type LoginPayload from '@/users/validators/login-payload';

type LoginUserResponse = { details: string };
type LoginUserPayload = z.infer<typeof LoginPayload>;

function loginQuery(builder: EndpointBuilder) {
  return builder.mutation<LoginUserResponse, LoginUserPayload>({
    queryFn: async (payload, _api, _extraOptions, baseQuery) => {
      const response = await baseQuery({
        url: '/login',
        method: METHODS.POST,
        body: payload,
      });
      if (response.error != null) return response;

      const responseData = response.data as { authorization_token: string };
      document.cookie = `Session=${responseData.authorization_token}; SameSite=Strict;`;

      return { data: { details: 'OK' } };
    },
  });
}

export default loginQuery;
