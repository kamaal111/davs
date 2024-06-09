'use client';

import React from 'react';
import { type IntlShape, useIntl } from 'react-intl';
import toast from 'react-hot-toast';
import type { z } from 'zod';

import messages from './messages';
import { useSignUpMutation } from '@/users/api';
import Form, { type FormField } from '@/components/form';
import SignUpPayload from '@/users/validators/sign-up-payload';

type FormInput = z.infer<typeof SignUpPayload>;

function SignUpForm() {
  const [signUp, signUpResult] = useSignUpMutation();

  const intl = useIntl();

  const signUpFormIsLoading = signUpResult.isLoading;

  const formFields: Array<FormField<keyof FormInput>> = React.useMemo(
    () => makeFormFields(intl),
    []
  );

  async function handleSubmit(formData: FormInput) {
    const result = await signUp(formData);
    if (result.error != null) {
      let details: string | undefined = undefined;
      if ('data' in result.error) {
        details = result.error.data?.details;
      }
      toast.error(details ?? 'Failed to create a user');
      return;
    }

    // To be continued .... to login probably
    console.log('result.data', result.data);
  }

  return (
    <Form
      fields={formFields}
      schema={SignUpPayload}
      submitButtonText={intl.formatMessage(messages.submitButton)}
      header={intl.formatMessage(messages.header)}
      disabled={signUpFormIsLoading}
      onSubmit={handleSubmit}
    />
  );
}

function makeFormFields(intl: IntlShape): Array<FormField<keyof FormInput>> {
  return [
    {
      id: 'username',
      placeholder: intl.formatMessage(messages.passwordFieldPlaceholder),
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
    {
      id: 'verificationPassword',
      placeholder: intl.formatMessage(messages.verifyPasswordFieldPlaceholder),
      label: intl.formatMessage(messages.verifyPasswordFieldLabel),
      type: 'password',
      errorMessages: {
        extra: intl.formatMessage(
          messages.passwordNotSameAsVerificationPassword
        ),
        too_small: intl.formatMessage(
          messages.verifyPasswordMinimumLengthError
        ),
      },
      extraValidation: ({ value, payload }) => {
        return value === (payload as FormInput).password;
      },
    },
  ];
}

export default SignUpForm;
