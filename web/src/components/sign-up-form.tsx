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

function SignUpForm() {
  return (
    <Card size="4">
      <Heading as="h3" size="6" trim="start" mb="5">
        Sign up
      </Heading>

      <Box mb="5">
        <Flex mb="1">
          <Text as="label" htmlFor="email-field" size="2" weight="bold">
            Email address
          </Text>
        </Flex>
        <TextField.Root placeholder="Enter your email" id="email-field" />
      </Box>

      <Box mb="5" position="relative">
        <Flex align="baseline" justify="between" mb="1">
          <Text as="label" size="2" weight="bold" htmlFor="password-field">
            Password
          </Text>
          <Link href="#" size="2" onClick={e => e.preventDefault()}>
            Forgot password?
          </Link>
        </Flex>
        <TextField.Root placeholder="Enter your password" id="password-field" />
      </Box>

      <Flex mt="6" justify="end" gap="3">
        <Button variant="outline">Create an account</Button>
        <Button>Sign in</Button>
      </Flex>
    </Card>
  );
}

export default SignUpForm;
