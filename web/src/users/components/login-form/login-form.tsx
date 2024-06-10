'use client';

import React from 'react';
import type { z } from 'zod';
import { type IntlShape, useIntl } from 'react-intl';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import messages from './messages';
import LoginPayload from '@/users/validators/login-payload';
import Form, { type FormField } from '@/components/form';
import { useLoginMutation } from '@/users/api';

type FormInput = z.infer<typeof LoginPayload>;

function LoginForm() {
  const [login, loginResult] = useLoginMutation();

  const intl = useIntl();

  const router = useRouter();

  const formFields: Array<FormField<keyof FormInput>> = React.useMemo(
    () => makeFormFields(intl),
    []
  );

  const loginFormIsLoading = loginResult.isLoading;

  async function handleSubmit(formData: FormInput) {
    const result = await login(formData);
    if (result.error != null) {
      let details: string | undefined = undefined;
      if ('data' in result.error) {
        details = result.error.data?.details;
      }
      toast.error(details ?? 'Failed to login');
      return;
    }

    router.push('/');
  }

  return (
    <Form
      fields={formFields}
      schema={LoginPayload}
      submitButtonText={intl.formatMessage(messages.submitButton)}
      header={intl.formatMessage(messages.header)}
      disabled={loginFormIsLoading}
      onSubmit={handleSubmit}
    />
  );
}

function makeFormFields(intl: IntlShape): Array<FormField<keyof FormInput>> {
  return [
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
  ];
}

export default LoginForm;
