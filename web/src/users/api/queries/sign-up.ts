import type { z } from 'zod';

import type SignUpPayload from '@/users/validators/sign-up-payload';
import type { EndpointBuilder } from '../types';
import METHODS from '@/common/http/methods';

type SignUpUserResponse = { details: string };
type SignUpUserPayload = z.infer<typeof SignUpPayload>;

function signUpQuery(builder: EndpointBuilder) {
  return builder.mutation<SignUpUserResponse, SignUpUserPayload>({
    query: payload => ({
      url: '/sign-up',
      method: METHODS.POST,
      body: payload,
    }),
  });
}

export default signUpQuery;
