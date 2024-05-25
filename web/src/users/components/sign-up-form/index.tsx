'use client';

import React from 'react';
import { Button, Card, Flex, Heading, Text, Link } from '@radix-ui/themes';
import { FormattedMessage, useIntl } from 'react-intl';
import toast from 'react-hot-toast';

import messages from './messages';
import TextField from '@/components/text-field';
import { useSignUpMutation } from '@/users/api/api';

function SignUpForm() {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  const intl = useIntl();

  const [signUp, signUpResult] = useSignUpMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = await signUp(formData);
    if (result.error != null) {
      const details =
        'data' in result.error ? result.error.data?.details : null;
      toast.error(details ?? 'Failed to create a user');
      return;
    }

    console.log('result.data', result.data);

    // console.log('success', success);

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

  const signUpFormIsLoading = signUpResult.isLoading;

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
          disabled={signUpFormIsLoading}
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
          disabled={signUpFormIsLoading}
        />

        <Flex mt="6" justify="end" gap="3" align="center">
          <Button
            variant="outline"
            type="submit"
            disabled={signUpFormIsLoading}
          >
            <FormattedMessage {...messages.submitButton} />
          </Button>
          <FormattedMessage {...messages.signInButton} />
        </Flex>
      </Card>
    </form>
  );
}

export default SignUpForm;
