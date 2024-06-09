import type { NextRequest } from 'next/server';

import apiErrorHandler from '@/common/errors/api-error-handler';

function loginHandler(request: NextRequest) {
  return apiErrorHandler(async () => {
    return Response.json({ details: 'OK' }, { status: 201 });
  });
}

export default loginHandler;
