import type { z } from 'zod';

import type { EndpointBuilder } from '../types';
import METHODS from '@/common/http/methods';
import type LoginPayload from '@/users/validators/login-payload';

type LoginUserResponse = { details: string };
type LoginUserPayload = z.infer<typeof LoginPayload>;

function loginQuery(builder: EndpointBuilder) {
  return builder.mutation<LoginUserResponse, LoginUserPayload>({
    query: payload => ({
      url: '/login',
      method: METHODS.POST,
      body: payload,
    }),
  });
}

export default loginQuery;
