import React from 'react';
import type { z } from 'zod';
import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useIntl } from 'react-intl';
import toast from 'react-hot-toast';

import TextField from '../text-field';
import type { FormField } from './types';
import messages from './messages';

function Form<
  FieldIDS extends string,
  Schema extends z.AnyZodObject,
  Payload extends z.infer<Schema>,
>({
  schema,
  fields,
  header,
  submitButtonText,
  onSubmit,
}: {
  header: string;
  submitButtonText: string;
  schema: Schema;
  fields: Array<FormField<FieldIDS>>;
  onSubmit: (payload: Payload) => void;
}) {
  const fieldIds = fields.map(field => field.id);

  const [formData, setFormData] = React.useState<Payload>(
    fieldIds.reduce((acc, current) => {
      return { ...acc, [current]: '' };
    }, {} as Payload)
  );
  const [focusedField, setFocusedField] = React.useState<keyof Payload | null>(
    null
  );

  const intl = useIntl();

  const validators: Record<string, z.ZodAny> = Object.fromEntries(
    fieldIds.map(field => [field, schema.shape[field]])
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = schema.safeParse(formData);
    if (!result.success) {
      const errorMessages =
        extractErrorMessagesFromValidationResult(result) ?? [];
      for (const {
        path: errorMessagePaths,
        code: errorMessageCode,
      } of errorMessages) {
        if (errorMessagePaths == null) continue;

        const errorMessagePath = errorMessagePaths[0];
        if (errorMessagePath == null) continue;

        const field = fields.find(({ id }) => id === errorMessagePath);
        if (field == null) continue;

        const fieldErrorMessage = field.errorMessages?.[errorMessageCode];
        if (fieldErrorMessage == null) continue;

        toast.error(fieldErrorMessage);
        return;
      }

      toast.error(intl.formatMessage(messages.defaultFormValidationError));
      return;
    }

    onSubmit(result.data as Payload);
  }

  function handleFieldChange(key: keyof Payload) {
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
        <Flex mt="6" justify="end" gap="3" align="center">
          <Button variant="outline" type="submit">
            {submitButtonText}
          </Button>
        </Flex>
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

  return JSON.parse(message) as Array<{
    code: z.ZodIssueCode;
    path?: Array<string>;
  }>;
}

export default Form;
