'use client';

import React from 'react';
import type { MessageDescriptor } from 'react-intl';
import type { z } from 'zod';

import messages from './messages';
import TextField from '@/components/text-field';
import loginPayload from '@/users/validators/login-payload';
import Form from '@/components/form';

type FormInput = z.infer<typeof loginPayload>;

const formFields: Array<{
  id: keyof FormInput;
  placeholder: MessageDescriptor;
  label: MessageDescriptor;
  type?: Parameters<typeof TextField>[0]['type'];
}> = [
  {
    id: 'username',
    placeholder: messages.usernameFieldPlaceholder,
    label: messages.usernameFieldLabel,
  },
  {
    id: 'password',
    placeholder: messages.passwordFieldPlaceholder,
    label: messages.passwordFieldLabel,
    type: 'password',
  },
];

function LoginForm() {
  return (
    <Form fields={formFields} schema={loginPayload} header={messages.header} />
  );
}

export default LoginForm;
