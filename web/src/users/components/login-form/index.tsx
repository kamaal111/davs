'use client';

import React from 'react';
import { Card, Heading, Text } from '@radix-ui/themes';
import { FormattedMessage, useIntl } from 'react-intl';

import messages from './messages';
import TextField from '@/components/text-field';

type FormInput = { username: string; password: string };

function LoginForm() {
  const [formData, setFormData] = React.useState<FormInput>({
    username: '',
    password: '',
  });

  const intl = useIntl();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleFieldChange(key: keyof FormInput) {
    return (value: string) => {
      setFormData({ ...formData, [key]: value });
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          <FormattedMessage {...messages.header} />
        </Heading>
        <TextField
          value={formData.username}
          placeholder={intl.formatMessage(messages.usernameFieldPlaceholder)}
          id="username"
          label={() => (
            <Text as="label" htmlFor="username" size="2" weight="bold">
              <FormattedMessage {...messages.usernameFieldLabel} />
            </Text>
          )}
          onChange={handleFieldChange('username')}
        />
      </Card>
    </form>
  );
}

export default LoginForm;
