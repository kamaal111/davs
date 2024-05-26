import type { NextRequest } from 'next/server';

import getAPIMessage from '@/translations/utils/get-api-message';
import { MESSAGES_KEYS } from '@/translations/messages/constants';

export async function POST(request: NextRequest) {
  let body: Awaited<ReturnType<typeof request.json>>;
  try {
    body = await request.json();
  } catch (error) {
    return Response.json(
      {
        details: getAPIMessage(
          request.headers,
          MESSAGES_KEYS.SIGN_UP_API_FAILED_TO_CREATE_USER_ERROR
        ),
      },
      { status: 400 }
    );
  }

  console.log('body', body);

  return Response.json({ details: 'hello' });
}
