import type { NextRequest } from 'next/server';
import type { z } from 'zod';

import signUpPayload from '@/users/validators/sign-up-payload';
import InvalidSignUpPayloadError from './errors/invalid-sign-up-payload-error';
import apiErrorHandler from '@/common/errors/api-error-handler';
import parseAPIPayload from '@/common/api/parse-api-payload';
import encryption from '@/encryption/encryption';
import METHODS from '@/common/http/methods';
import loadRequiredEnv from '@/common/env/load-required-env';
import UserAlreadyExists from './errors/user-already-exists';
import FailedToCreateUser from './errors/failed-to-create-user';

const { DAVS_API_KEY, DAVS_SERVER_BASE_URL } = loadRequiredEnv([
  'DAVS_API_KEY',
  'DAVS_SERVER_BASE_URL',
]);

export function POST(request: NextRequest) {
  return apiErrorHandler(async () => {
    let body: z.infer<typeof signUpPayload>;
    try {
      body = await parseAPIPayload(request, signUpPayload);
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
