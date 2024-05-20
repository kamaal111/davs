import React from 'react';
import { Box, Flex, TextField as RadixTextField } from '@radix-ui/themes';

type Props = {
  label: () => React.ReactNode;
  placeholder?: string;
  id?: string;
  onChange: (text: string) => void;
  value: string;
  type?: Parameters<typeof RadixTextField.Root>[0]['type'];
};

function TextField({ label, placeholder, id, onChange, value, type }: Props) {
  return (
    <Box mb="5" position="relative">
      <Flex align="baseline" justify="between" mb="1">
        {label()}
      </Flex>
      <RadixTextField.Root
        type={type}
        value={value}
        placeholder={placeholder}
        id={id}
        onChange={e => onChange(e.target.value)}
      />
    </Box>
  );
}

export default TextField;
