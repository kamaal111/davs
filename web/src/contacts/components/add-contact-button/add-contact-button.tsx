import { Button, Text } from '@radix-ui/themes';
import { FormattedMessage } from 'react-intl';
import { PlusIcon } from '@radix-ui/react-icons';

import messages from './messages';
import { useRouter } from 'next/navigation';

function AddContactButton() {
  const router = useRouter();

  function handleAddContactClick() {
    router.push('/contact');
  }

  return (
    <Button onClick={handleAddContactClick}>
      <Text>
        <FormattedMessage {...messages.addContact} />
      </Text>
      <PlusIcon width="18" height="18" />
    </Button>
  );
}

export default AddContactButton;
