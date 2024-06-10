'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import { Button, Flex, Text } from '@radix-ui/themes';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

function ContactsNavigationBar() {
  function handleAddContactClick() {
    console.log('click');
  }

  return (
    <Flex justify={'end'}>
      <Button onClick={handleAddContactClick}>
        <Text>
          <FormattedMessage {...messages.addContact} />
        </Text>
        <PlusIcon width="18" height="18" />
      </Button>
    </Flex>
  );
}

export default ContactsNavigationBar;
