import React from 'react';
import type { z } from 'zod';
import { Card, Heading, Text } from '@radix-ui/themes';

import TextField from '../text-field';
import type { FormField } from './types';

function Form({
  schema,
  fields,
  header,
}: {
  header: string;
  schema: z.AnyZodObject;
  fields: Array<FormField>;
}) {
  const fieldIds = fields.map(field => field.id);

  const [formData, setFormData] = React.useState<z.infer<typeof schema>>(
    fieldIds.reduce(
      (acc, current) => {
        return { ...acc, [current]: '' };
      },
      {} as z.infer<typeof schema>
    )
  );
  const [focusedField, setFocusedField] = React.useState<
    keyof z.infer<typeof schema> | null
  >(null);

  const validators: Record<string, z.ZodAny> = Object.fromEntries(
    fieldIds.map(field => [field, schema.shape[field]])
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleFieldChange(key: keyof z.infer<typeof schema>) {
    return (value: string) => {
      setFormData({ ...formData, [key]: value });
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          {header}
        </Heading>
        {fields.map(({ id, placeholder, label, type, errorMessages }) => {
          const idString = id as string;
          const value = formData[idString];
          const { isValid, errorMessage } = validateField({
            value: formData[idString],
            isFocused: focusedField === idString,
            schema: validators[idString],
            errorMessages,
          });

          return (
            <TextField
              key={idString}
              value={value}
              placeholder={placeholder}
              id={idString}
              type={type}
              label={() => (
                <Text as="label" htmlFor={idString} size="2" weight="bold">
                  {label}
                </Text>
              )}
              onChange={handleFieldChange(idString)}
              onFocus={() => setFocusedField(idString)}
              isInvalid={!isValid}
              invalidMessage={errorMessage}
            />
          );
        })}
      </Card>
    </form>
  );
}

function validateField<TargetValue>({
  value,
  isFocused,
  schema,
  errorMessages,
}: {
  value: TargetValue;
  isFocused: boolean;
  schema: z.ZodAny;
  errorMessages?: Partial<Record<z.ZodIssueCode, string>>;
}) {
  let isValid = isFocused || String(value).length === 0;
  let parseResult: z.SafeParseReturnType<unknown, unknown> | null = null;
  if (!isValid) {
    parseResult = schema.safeParse(value);
    isValid = parseResult.success;
  }

  let errorMessage: string | null | undefined = null;
  if (parseResult != null && errorMessages != null) {
    const extractedMessage =
      extractErrorMessagesFromValidationResult(parseResult);
    const errorCode = extractedMessage?.find(
      ({ code }) => errorMessages[code] != null
    )?.code;
    if (errorCode != null) {
      errorMessage = errorMessages[errorCode];
    }
  }

  return { isValid, errorMessage };
}

function extractErrorMessagesFromValidationResult(
  result: z.SafeParseReturnType<unknown, unknown>
) {
  const message = result.error?.message;
  if (message == null) return null;

  return JSON.parse(message) as Array<{ code: z.ZodIssueCode }>;
}

export default Form;
