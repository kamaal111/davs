import React from 'react';
import { Box, Flex, TextField as RadixTextField } from '@radix-ui/themes';

function TextField({
  label,
  placeholder,
  id,
}: {
  label: () => React.ReactNode;
  placeholder?: string;
  id?: string;
}) {
  return (
    <Box mb="5" position="relative">
      <Flex align="baseline" justify="between" mb="1">
        {label()}
      </Flex>
      <RadixTextField.Root placeholder={placeholder} id={id} />
    </Box>
  );
}

export default TextField;
