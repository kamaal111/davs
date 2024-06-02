import type { NextRequest } from 'next/server';
import type { z } from 'zod';

import signUpPayload from '@/users/validators/sign-up-payload';
import InvalidSignUpPayloadError from './errors/invalid-sign-up-payload-error';
import apiErrorHandler from '@/common/errors/api-error-handler';
import parseAPIPayload from '@/common/api/parse-api-payload';
import encryption from '@/encryption/encryption';
import METHODS from '@/common/http/methods';

const { DAVS_API_KEY } = process.env;

if (!DAVS_API_KEY) throw new Error('DAVS_API_KEY not defined in .nev');

export function POST(request: NextRequest) {
  return apiErrorHandler(async () => {
    let body: z.infer<typeof signUpPayload>;
    try {
      body = await parseAPIPayload(request, signUpPayload);
    } catch (error) {
      throw new InvalidSignUpPayloadError(request, { cause: error as Error });
    }

    const encryptedBody = encryption.aes.encryptObject(body);
    const response = await fetch(
      'http://host.docker.internal:8000/api/v1/users',
      {
        method: METHODS.POST,
        body: JSON.stringify({ message: encryptedBody }),
        headers: { authorization: `Token ${DAVS_API_KEY!}` },
      }
    );
    console.log('response', await response.json());

    console.log('body', encryption.aes.decrypt(encryptedBody));
    return Response.json({ details: 'hello' });
  });
}
