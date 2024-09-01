import type { NextRequest } from 'next/server';

import loginHandler from '@/users/server/route-handlers/login-handler';

export function POST(request: NextRequest) {
  return loginHandler(request);
}
