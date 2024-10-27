import type { z } from 'zod';

import type TextField from '../text-field';

type TextFieldProps = React.ComponentProps<typeof TextField>;

export type FormField<ID extends string = string> = {
  id: ID;
  placeholder: string;
  label?: string;
  type?: TextFieldProps['type'];
  errorMessages?: Partial<Record<z.ZodIssueCode | 'extra', string>>;
  autoComplete?: TextFieldProps['autoComplete'];
  extraValidation?: ({
    value,
    payload,
  }: {
    value: unknown;
    payload: unknown;
  }) => boolean;
};
