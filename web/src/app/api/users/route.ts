import type { NextRequest } from 'next/server';
import type { z } from 'zod';

import signUpPayload from '@/users/validators/sign-up-payload';
import InvalidSignUpPayloadError from './errors/invalid-sign-up-payload-error';
import apiErrorHandler from '@/common/errors/api-error-handler';
import parseAPIPayload from '@/common/api/parse-api-payload';
import encryption from '@/encryption/encryption';

export function POST(request: NextRequest) {
  return apiErrorHandler(async () => {
    let body: z.infer<typeof signUpPayload>;
    try {
      body = await parseAPIPayload(request, signUpPayload);
    } catch (error) {
      throw new InvalidSignUpPayloadError(request, { cause: error as Error });
    }

    console.log('raw body', body);
    const encryptedBody = encryption.encrypt(body);
    console.log('encryptedBody', encryptedBody);
    console.log('body', body, encryption.decrypt(encryptedBody));
    return Response.json({ details: 'hello' });
  });
}
