import type { NextRequest } from 'next/server';

import getAPIMessage from '@/translations/utils/get-api-message';
import { MESSAGES_KEYS } from '@/translations/messages/constants';
import APIError from '@/common/errors/api-error';

class UserAlreadyExists extends APIError {
  constructor(request: NextRequest, options?: { cause?: Error }) {
    super(
      getAPIMessage(
        request.headers,
        MESSAGES_KEYS.SIGN_UP_API_USER_ALREADY_EXISTS_ERROR
      ),
      409,
      options ?? {}
    );
  }
}

export default UserAlreadyExists;
