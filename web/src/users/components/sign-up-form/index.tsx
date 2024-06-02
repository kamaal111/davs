'use client';

import React from 'react';
import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { FormattedMessage, useIntl } from 'react-intl';
import toast from 'react-hot-toast';

import messages from './messages';
import TextField from '@/components/text-field';
import { useSignUpMutation } from '@/users/api/api';
import useInputStates from '@/common/hooks/use-input-states';

function SignUpForm() {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    verificationPassword: '',
  });

  const {
    inputRef: verificationPasswordInputRef,
    state: verificationPasswordInputState,
  } = useInputStates({ events: ['blur', 'focus'], defaultEvent: 'blur' });

  const intl = useIntl();

  const [signUp, signUpResult] = useSignUpMutation();

  const passwordVerified = formData.password === formData.verificationPassword;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!passwordVerified) {
      if (formData.verificationPassword.length !== 0) {
        toast.error(
          intl.formatMessage(messages.passwordNotSameAsVerificationPassword)
        );
      }
      return;
    }

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
            <Text as="label" size="2" weight="bold" htmlFor="password">
              <FormattedMessage {...messages.passwordFieldLabel} />
            </Text>
          )}
          onChange={handleFieldChange('password')}
          disabled={signUpFormIsLoading}
        />

        <TextField
          ref={verificationPasswordInputRef}
          value={formData.verificationPassword}
          placeholder={intl.formatMessage(
            messages.verifyPasswordFieldPlaceholder
          )}
          id="verify-password"
          type="password"
          label={() => (
            <Text as="label" size="2" weight="bold" htmlFor="verify-password">
              <FormattedMessage {...messages.verifyPasswordFieldLabel} />
            </Text>
          )}
          onChange={handleFieldChange('verificationPassword')}
          disabled={signUpFormIsLoading}
          isInvalid={
            !passwordVerified &&
            formData.verificationPassword.length > 0 &&
            formData.password.length > 0 &&
            verificationPasswordInputState !== 'focus'
          }
          invalidMessage={intl.formatMessage(
            messages.passwordNotSameAsVerificationPassword
          )}
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
