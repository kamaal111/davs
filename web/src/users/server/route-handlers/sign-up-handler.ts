'use server';

import type { z } from 'zod';
import type { NextRequest } from 'next/server';

import apiErrorHandler from '@/common/errors/api-error-handler';
import SignUpPayload from '../../validators/sign-up-payload';
import parseAPIPayload from '@/common/api/parse-api-payload';
import InvalidSignUpPayloadError from '@/users/server/errors/invalid-sign-up-payload-error';
import encryption from '@/encryption/encryption';
import loadRequiredEnv from '@/common/env/load-required-env';
import METHODS from '@/common/http/methods';
import FailedToCreateUser from '../errors/failed-to-create-user';
import UserAlreadyExists from '../errors/user-already-exists';

const { DAVS_API_KEY, DAVS_SERVER_BASE_URL } = loadRequiredEnv([
  'DAVS_API_KEY',
  'DAVS_SERVER_BASE_URL',
]);

function signUpHandler(request: NextRequest) {
  return apiErrorHandler(async () => {
    let body: z.infer<typeof SignUpPayload>;
    try {
      body = await parseAPIPayload(request, SignUpPayload);
    } catch (error) {
      throw new InvalidSignUpPayloadError(request, { cause: error as Error });
    }

    const encryptedBody = encryption.aes.encryptObject(body);
    const response = await fetch(`${DAVS_SERVER_BASE_URL}/api/v1/users`, {
      method: METHODS.POST,
      body: JSON.stringify({ message: encryptedBody }),
      headers: { authorization: `Token ${DAVS_API_KEY!}` },
    });
    if (!response.ok) {
      if (response.status === 409) throw new UserAlreadyExists(request);
      else throw new FailedToCreateUser(request, response.status);
    }

    return Response.json({ details: 'OK' }, { status: 201 });
  });
}

export default signUpHandler;
