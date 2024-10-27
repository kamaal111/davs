import React from 'react';
import { Box, Flex, TextField as RadixTextField } from '@radix-ui/themes';

import styles from './text-field.module.sass';

type InputProps = Pick<
  Partial<React.ComponentProps<'input'>>,
  'onFocus' | 'onChange' | 'disabled' | 'onBlur' | 'autoComplete' | 'ref'
>;

type Props = InputProps & {
  label?: () => React.ReactNode;
  placeholder: string;
  id?: string;
  value?: string;
  type?: Parameters<typeof RadixTextField.Root>[0]['type'];
  isInvalid?: boolean;
  invalidMessage?: string | null;
};

const TextField = ({
  label,
  placeholder,
  id,
  value,
  type,
  isInvalid,
  invalidMessage,
  autoComplete,
  ref,
  ...inputProps
}: Props) => {
  return (
    <Box mb="5" position="relative">
      {label ? (
        <Flex align="baseline" justify="between" mb="1">
          {label()}
        </Flex>
      ) : null}
      <RadixTextField.Root
        className={isInvalid ? styles.isInvalid : undefined}
        type={type}
        value={value}
        placeholder={placeholder}
        id={id}
        ref={ref}
        autoComplete={autoComplete}
        {...inputProps}
      />
      {isInvalid && invalidMessage ? (
        <p className={styles.invalidMessage}>{invalidMessage}</p>
      ) : null}
    </Box>
  );
};

export default TextField;
