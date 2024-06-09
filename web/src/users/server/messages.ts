import { defineMessages } from 'react-intl';

const messages = defineMessages({
  invalidSignUpPayload: {
    id: 'SIGN_UP_API.INVALID_SIGN_UP_PAYLOAD_ERROR',
    defaultMessage: 'Invalid sign up information given',
    description: 'User provided invalid sign up information',
  },
  userAlreadyExists: {
    id: 'SIGN_UP_API.USER_ALREADY_EXISTS_ERROR',
    defaultMessage: 'User already exists',
    description: 'User already exists error message',
  },
  invalidLoginPayload: {
    id: 'LOGIN_API.INVALID_LOGIN_PAYLOAD_ERROR',
    defaultMessage: 'Invalid login information given',
    description: 'User provided invalid login information',
  },
});

export default messages;
