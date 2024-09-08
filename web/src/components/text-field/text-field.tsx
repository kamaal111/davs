import React from 'react';
import { Box, Flex, TextField as RadixTextField } from '@radix-ui/themes';

import styles from './text-field.module.sass';

type Props = {
  label: () => React.ReactNode;
  placeholder?: string;
  id?: string;
  onChange: (text: string) => void;
  value: string;
  type?: Parameters<typeof RadixTextField.Root>[0]['type'];
  disabled?: boolean;
  isInvalid?: boolean;
  invalidMessage?: string | null;
  onFocus?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
};

function TextField({
  label,
  placeholder,
  id,
  onChange,
  value,
  type,
  disabled,
  isInvalid,
  invalidMessage,
  onFocus,
}: Props) {
  return (
    <Box mb="5" position="relative">
      <Flex align="baseline" justify="between" mb="1">
        {label()}
      </Flex>
      <RadixTextField.Root
        className={isInvalid ? styles.isInvalid : undefined}
        type={type}
        value={value}
        placeholder={placeholder}
        id={id}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        onFocus={onFocus}
      />
      {isInvalid && invalidMessage ? (
        <p className={styles.invalidMessage}>{invalidMessage}</p>
      ) : null}
    </Box>
  );
}

export default TextField;
