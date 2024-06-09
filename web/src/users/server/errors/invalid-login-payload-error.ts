import type { NextRequest } from 'next/server';

import APIError from '@/common/errors/api-error';
import getAPIMessage from '@/translations/utils/get-api-message';
import { MESSAGES_KEYS } from '@/translations/messages/constants';

class InvalidLoginPayloadError extends APIError {
  constructor(
    request: NextRequest,
    options?: { cause?: Error; status?: number }
  ) {
    super(
      getAPIMessage(
        request.headers,
        MESSAGES_KEYS.LOGIN_API_INVALID_LOGIN_PAYLOAD_ERROR
      ),
      options?.status ?? 400,
      options ?? {}
    );
  }
}

export default InvalidLoginPayloadError;
