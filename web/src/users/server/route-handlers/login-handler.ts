import type { NextRequest } from 'next/server';
import type { z } from 'zod';

import apiErrorHandler from '@/common/errors/api-error-handler';
import LoginPayload from '@/users/validators/login-payload';
import parseAPIPayload from '@/common/api/parse-api-payload';
import InvalidLoginPayloadError from '../errors/invalid-login-payload-error';
import davsClient from '@/common/clients/davs-client';
import InvalidCredentialsError from '../errors/invalid-credentials-error';
import cookies from '@/common/api/cookies';

function loginHandler(request: NextRequest) {
  return apiErrorHandler(async () => {
    let body: z.infer<typeof LoginPayload>;
    try {
      body = await parseAPIPayload(request, LoginPayload);
    } catch (error) {
      throw new InvalidLoginPayloadError(request, { cause: error as Error });
    }

    const response = await davsClient.users.login(body);
    if (!response.ok) {
      if (response.status === 403) throw new InvalidCredentialsError(request);
      throw new InvalidLoginPayloadError(request, { status: response.status });
    }

    const responseJSON: { authorization_token: string } = await response.json();
    await cookies.setSession(responseJSON.authorization_token);

    return Response.json({ details: 'OK' }, { status: 200 });
  });
}

export default loginHandler;
