'use client';

import { Flex } from '@radix-ui/themes';

import AddContactButton from '../add-contact-button';

function ContactsNavigationBar() {
  return (
    <Flex justify={'end'}>
      <AddContactButton />
    </Flex>
  );
}

export default ContactsNavigationBar;
