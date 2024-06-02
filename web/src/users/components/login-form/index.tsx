'use client';

import { Card, Heading } from '@radix-ui/themes';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

function LoginForm() {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          <FormattedMessage {...messages.header} />
        </Heading>
      </Card>
    </form>
  );
}

export default LoginForm;
