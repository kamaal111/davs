'use client';

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Link,
  Text,
  TextField,
} from '@radix-ui/themes';
import { FormattedMessage, useIntl } from 'react-intl';

import messages from './messages';

function SignUpForm() {
  const intl = useIntl();

  return (
    <form>
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          <FormattedMessage {...messages.header} />
        </Heading>

        <Box mb="5">
          <Flex mb="1">
            <Text as="label" htmlFor="username-field" size="2" weight="bold">
              <FormattedMessage {...messages.usernameFieldLabel} />
            </Text>
          </Flex>
          <TextField.Root
            placeholder={intl.formatMessage(messages.usernameFieldPlaceholder)}
            id="username-field"
          />
        </Box>

        <Box mb="5" position="relative">
          <Flex align="baseline" justify="between" mb="1">
            <Text as="label" size="2" weight="bold" htmlFor="password-field">
              <FormattedMessage {...messages.passwordFieldLabel} />
            </Text>
            <Link href="#" size="2" onClick={e => e.preventDefault()}>
              <FormattedMessage {...messages.forgotPasswordLink} />
            </Link>
          </Flex>
          <TextField.Root
            placeholder={intl.formatMessage(messages.passwordFieldPlaceholder)}
            id="password-field"
          />
        </Box>

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
