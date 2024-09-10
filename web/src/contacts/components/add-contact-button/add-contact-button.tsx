import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Text } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';

import messages from './messages';
import { useRouter } from 'next/navigation';

function AddContactButton() {
  const [navigating, setNavigating] = React.useState(false);

  const router = useRouter();

  function handleAddContactClick() {
    setNavigating(true);
    router.push('/contact');
    setNavigating(false);
  }

  return (
    <Button onClick={handleAddContactClick} disabled={navigating}>
      <Text>
        <FormattedMessage {...messages.addContact} />
      </Text>
      <PlusIcon width="18" height="18" />
    </Button>
  );
}

export default AddContactButton;
