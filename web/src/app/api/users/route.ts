import type { NextRequest } from 'next/server';

import signUpHandler from '@/users/server/route-handlers/sign-up-handler';

export function POST(request: NextRequest) {
  return signUpHandler(request);
}
