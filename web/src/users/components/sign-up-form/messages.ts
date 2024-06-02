import { defineMessages } from 'react-intl';

const messages = defineMessages({
  header: {
    id: 'SIGN_UP_FORM.HEADER',
    defaultMessage: 'Sign up',
    description: 'Sign up form header',
  },
  usernameFieldLabel: {
    id: 'SIGN_UP_FORM.USERNAME_FIELD_LABEL',
    defaultMessage: 'Username',
    description: 'Sign up forms username field label',
  },
  usernameFieldPlaceholder: {
    id: 'SIGN_UP_FORM.USERNAME_FIELD_PLACEHOLDER',
    defaultMessage: 'Enter your username',
    description: 'Sign up forms username field placeholder',
  },
  passwordFieldLabel: {
    id: 'SIGN_UP_FORM.PASSWORD_FIELD_LABEL',
    defaultMessage: 'Password',
    description: 'Sign up forms password field label',
  },
  verifyPasswordFieldLabel: {
    id: 'SIGN_UP_FORM.VERIFY_PASSWORD_FIELD_LABEL',
    defaultMessage: 'Verify password',
    description: 'Sign up forms verify password field label',
  },
  passwordFieldPlaceholder: {
    id: 'SIGN_UP_FORM.PASSWORD_FIELD_PLACEHOLDER',
    defaultMessage: 'Enter your password',
    description: 'Sign up forms password field placeholder',
  },
  verifyPasswordFieldPlaceholder: {
    id: 'SIGN_UP_FORM.VERIFY_PASSWORD_FIELD_PLACEHOLDER',
    defaultMessage: 'Verify your password',
    description: 'Sign up forms verify password field placeholder',
  },
  passwordNotSameAsVerificationPassword: {
    id: 'SIGN_UP_FORM.PASSWORD_NOT_SAME_AS_VERIFICATION_PASSWORD',
    defaultMessage: 'Password is not the same as the verification password',
    description:
      'Sign up forms verify password is not the same as the given password',
  },
  submitButton: {
    id: 'SIGN_UP_FORM.SUBMIT_BUTTON',
    defaultMessage: 'Create an account',
    description: 'Sign up forms submit button',
  },
  signInButton: {
    id: 'SIGN_UP_FORM.SIGN_IN_BUTTON',
    defaultMessage: 'Sign in',
    description: 'Sign up forms sign in button',
  },
});

export default messages;
