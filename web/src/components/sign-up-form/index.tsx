'use client';

import { Button, Card, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { FormattedMessage, useIntl } from 'react-intl';

import messages from './messages';
import TextField from '../text-field';

function SignUpForm() {
  const intl = useIntl();

  return (
    <form>
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          <FormattedMessage {...messages.header} />
        </Heading>

        <TextField
          placeholder={intl.formatMessage(messages.usernameFieldPlaceholder)}
          id="username-field"
          label={() => (
            <Text as="label" htmlFor="username-field" size="2" weight="bold">
              <FormattedMessage {...messages.usernameFieldLabel} />
            </Text>
          )}
        />

        <TextField
          placeholder={intl.formatMessage(messages.passwordFieldPlaceholder)}
          id="password-field"
          label={() => (
            <>
              <Text as="label" size="2" weight="bold" htmlFor="password-field">
                <FormattedMessage {...messages.passwordFieldLabel} />
              </Text>
              <Link href="#" size="2" onClick={e => e.preventDefault()}>
                <FormattedMessage {...messages.forgotPasswordLink} />
              </Link>
            </>
          )}
        />

        <Flex mt="6" justify="end" gap="3">
          <Button variant="outline">
            <FormattedMessage {...messages.submitButton} />
          </Button>
          <FormattedMessage {...messages.signInButton} />
        </Flex>
      </Card>
    </form>
  );
}

export default SignUpForm;
