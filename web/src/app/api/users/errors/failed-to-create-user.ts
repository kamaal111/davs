import type { NextRequest } from 'next/server';

import APIError from '@/common/errors/api-error';
import getAPIMessage from '@/translations/utils/get-api-message';
import { MESSAGES_KEYS } from '@/translations/messages/constants';

class FailedToCreateUser extends APIError {
  constructor(request: NextRequest, code: number, options?: { cause?: Error }) {
    super(
      getAPIMessage(
        request.headers,
        MESSAGES_KEYS.SIGN_UP_API_INVALID_SIGN_UP_PAYLOAD_ERROR
      ),
      code,
      options ?? {}
    );
  }
}

export default FailedToCreateUser;
