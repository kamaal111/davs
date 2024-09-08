import type { NextRequest } from 'next/server';

import getAPIMessage from '@/translations/utils/get-api-message';
import { MESSAGES_KEYS } from '@/translations/messages/constants';
import APIError from '@/common/errors/api-error';

class InvalidCredentialsError extends APIError {
  constructor(request: NextRequest, options?: { cause?: Error }) {
    super(
      getAPIMessage(
        request.headers,
        MESSAGES_KEYS.LOGIN_API_INVALID_LOGIN_CREDENTIALS_ERROR
      ),
      403,
      options ?? {}
    );
  }
}

export default InvalidCredentialsError;
