import type { NextRequest } from 'next/server';

import getAPIMessage from '@/translations/utils/get-api-message';
import { MESSAGES_KEYS } from '@/translations/messages/constants';
import signUpPayload from '@/users/validators/sign-up-payload';

class InvalidJSONError extends Error {}

class InvalidSignUpPayloadError extends Error {}

export async function POST(request: NextRequest) {
  let body: Awaited<ReturnType<typeof parsePayload>>;
  try {
    body = await parsePayload(request);
  } catch (error) {
    return Response.json(
      {
        details: getAPIMessage(
          request.headers,
          error instanceof InvalidSignUpPayloadError
            ? MESSAGES_KEYS.SIGN_UP_API_INVALID_SIGN_UP_PAYLOAD_ERROR
            : MESSAGES_KEYS.SIGN_UP_API_FAILED_TO_CREATE_USER_ERROR
        ),
      },
      { status: 400 }
    );
  }

  console.log('body', body);

  return Response.json({ details: 'hello' });
}

async function parsePayload(request: NextRequest) {
  let body: Awaited<ReturnType<typeof request.json>>;
  try {
    body = await request.json();
  } catch (error) {
    throw new InvalidJSONError();
  }

  try {
    return signUpPayload.parse(body);
  } catch (error) {
    throw new InvalidSignUpPayloadError();
  }
}
