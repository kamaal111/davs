'use server';

import type { z } from 'zod';
import type { NextRequest } from 'next/server';

import apiErrorHandler from '@/common/errors/api-error-handler';
import SignUpPayload from '../../validators/sign-up-payload';
import parseAPIPayload from '@/common/api/parse-api-payload';
import InvalidSignUpPayloadError from '@/users/server/errors/invalid-sign-up-payload-error';
import FailedToCreateUser from '../errors/failed-to-create-user';
import UserAlreadyExists from '../errors/user-already-exists';
import davsClient from '@/common/clients/davs-client';

function signUpHandler(request: NextRequest) {
  return apiErrorHandler(async () => {
    let body: z.infer<typeof SignUpPayload>;
    try {
      body = await parseAPIPayload(request, SignUpPayload);
    } catch (error) {
      throw new InvalidSignUpPayloadError(request, { cause: error as Error });
    }

    const response = await davsClient.users.signUp(body);
    if (!response.ok) {
      if (response.status === 409) throw new UserAlreadyExists(request);
      throw new FailedToCreateUser(request, response.status);
    }

    return Response.json({ details: 'Created' }, { status: 201 });
  });
}

export default signUpHandler;
