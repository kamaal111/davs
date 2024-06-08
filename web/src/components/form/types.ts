import type { z } from 'zod';

import type TextField from '../text-field';

export type FormField<ID extends string = string> = {
  id: ID;
  placeholder: string;
  label: string;
  type?: Parameters<typeof TextField>[0]['type'];
  errorMessages?: Partial<Record<z.ZodIssueCode | 'extra', string>>;
  extraValidation?: ({
    value,
    payload,
  }: {
    value: unknown;
    payload: unknown;
  }) => boolean;
};
