import type { NextRequest } from 'next/server';

import getAPIMessage from '@/translations/utils/get-api-message';
// import messages from './messages';

export async function POST(request: NextRequest) {
  // let body: Awaited<ReturnType<typeof request.json>>;
  // try {
  //   body = await request.json();
  // } catch (error) {
  return Response.json(
    {
      details: getAPIMessage(
        request.headers,
        'SIGN_UP_API.FAILED_TO_CREATE_USER_ERROR'
      ),
    },
    { status: 400 }
  );
  // }

  // return Response.json({ details: 'hello' });
}
