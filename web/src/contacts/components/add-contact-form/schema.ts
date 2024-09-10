import { z } from 'zod';

import toEntries from '@/common/objects/to-entries';

const formSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;

type FormRegisterOptions = Record<
  keyof FormSchema,
  {
    minLength: number;
  }
>;

export const formRegisterOptions = toEntries(formSchema.shape).reduce(
  (options, [key, field]) => {
    return { ...options, [key]: { minLength: field.minLength ?? 0 } };
  },
  {} as FormRegisterOptions
);

export default formSchema;
