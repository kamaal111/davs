import { defineMessages } from 'react-intl';

const messages = defineMessages({
  failedToCreateUser: {
    id: 'SIGN_UP_API.FAILED_TO_CREATE_USER_ERROR',
    defaultMessage: 'Failed to create user',
    description: 'Sign up api failed to create user error message',
  },
  invalidSignUpPayload: {
    id: 'SIGN_UP_API.INVALID_SIGN_UP_PAYLOAD_ERROR',
    defaultMessage: 'Invalid sign up information given',
    description: 'User provided invalid sign up information',
  },
});

export default messages;
