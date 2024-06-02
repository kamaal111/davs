import { defineMessages } from 'react-intl';

const messages = defineMessages({
  header: {
    id: 'LOGIN_FORM.HEADER',
    defaultMessage: 'Login',
    description: 'Login form header',
  },
  usernameFieldLabel: {
    id: 'LOGIN_FORM.USERNAME_FIELD_LABEL',
    defaultMessage: 'Username',
    description: 'Login forms username field label',
  },
  usernameFieldPlaceholder: {
    id: 'LOGIN_FORM.USERNAME_FIELD_PLACEHOLDER',
    defaultMessage: 'Enter your username',
    description: 'Login forms username field placeholder',
  },
  passwordFieldLabel: {
    id: 'LOGIN_FORM.PASSWORD_FIELD_LABEL',
    defaultMessage: 'Password',
    description: 'Login forms password field label',
  },
  passwordFieldPlaceholder: {
    id: 'LOGIN_FORM.PASSWORD_FIELD_PLACEHOLDER',
    defaultMessage: 'Enter your password',
    description: 'Login forms password field placeholder',
  },
});

export default messages;
