'use client';

import React from 'react';
import { Button, Card, Flex, Heading, Text, Link } from '@radix-ui/themes';
import { FormattedMessage, useIntl } from 'react-intl';

import TextField from '../text-field';
import messages from './messages';

function SignUpForm() {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  const intl = useIntl();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('formData', formData);
    clearForm();
  }

  function clearForm() {
    setFormData({
      username: '',
      password: '',
    });
  }

  function handleFieldChange(field: keyof typeof formData) {
    return (value: string) => setFormData({ ...formData, [field]: value });
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

        <TextField
          value={formData.password}
          placeholder={intl.formatMessage(messages.passwordFieldPlaceholder)}
          id="password"
          type="password"
          label={() => (
            <>
              <Text as="label" size="2" weight="bold" htmlFor="password">
                <FormattedMessage {...messages.passwordFieldLabel} />
              </Text>
              <Link href="#" size="2" onClick={e => e.preventDefault()}>
                <FormattedMessage {...messages.forgotPasswordLink} />
              </Link>
            </>
          )}
          onChange={handleFieldChange('password')}
        />

        <Flex mt="6" justify="end" gap="3">
          <Button variant="outline" type="submit">
            <FormattedMessage {...messages.submitButton} />
          </Button>
          <FormattedMessage {...messages.signInButton} />
        </Flex>
      </Card>
    </form>
  );
}

export default SignUpForm;
