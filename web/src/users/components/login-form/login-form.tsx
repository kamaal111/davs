'use client';

import React from 'react';
import type { z } from 'zod';
import { useIntl } from 'react-intl';

import messages from './messages';
import LoginPayload from '@/users/validators/login-payload';
import Form, { type FormField } from '@/components/form';

type FormInput = z.infer<typeof LoginPayload>;

function LoginForm() {
  const intl = useIntl();

  const formFields: Array<FormField<keyof FormInput>> = React.useMemo(
    () => [
      {
        id: 'username',
        placeholder: intl.formatMessage(messages.usernameFieldPlaceholder),
        label: intl.formatMessage(messages.usernameFieldLabel),
        errorMessages: {
          too_small: intl.formatMessage(messages.usernameMinimumLengthError),
        },
      },
      {
        id: 'password',
        placeholder: intl.formatMessage(messages.passwordFieldPlaceholder),
        label: intl.formatMessage(messages.passwordFieldLabel),
        type: 'password',
        errorMessages: {
          too_small: intl.formatMessage(messages.passwordMinimumLengthError),
        },
      },
    ],
    []
  );

  return (
    <Form
      fields={formFields}
      schema={LoginPayload}
      submitButtonText={intl.formatMessage(messages.submitButton)}
      header={intl.formatMessage(messages.header)}
      onSubmit={payload => {
        console.log('🐸🐸🐸 payload', payload);
      }}
    />
  );
}

export default LoginForm;