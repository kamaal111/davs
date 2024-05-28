import type { NextRequest } from 'next/server';

import APIError from './api-error';
import getAPIMessage from '@/translations/utils/get-api-message';
import { MESSAGES_KEYS } from '@/translations/messages/constants';

class InvalidJSONError extends APIError {
  constructor(request: NextRequest, options?: { cause?: Error }) {
    super(
      getAPIMessage(
        request.headers,
        MESSAGES_KEYS.COMMON_API_INVALID_JSON_ERROR
      ),
      400,
      options ?? {}
    );
  }
}

export default InvalidJSONError;
