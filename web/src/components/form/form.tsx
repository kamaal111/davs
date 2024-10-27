import React from 'react';
import type { z } from 'zod';
import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useIntl } from 'react-intl';
import toast from 'react-hot-toast';

import TextField from '../text-field';
import type { FormField } from './types';
import messages from './messages';

type Props<FieldIDS extends string, Schema extends z.AnyZodObject> = {
  header: string;
  submitButtonText: string;
  schema: Schema;
  fields: Array<FormField<FieldIDS>>;
  disabled?: boolean;
  onSubmit: (payload: z.infer<Schema>) => void;
  secondaryButton?: {
    label: string;
    onClick: () => void;
  };
};

function Form<FieldIDS extends string, Schema extends z.AnyZodObject>({
  schema,
  fields,
  header,
  submitButtonText,
  disabled,
  onSubmit,
  secondaryButton,
}: Props<FieldIDS, Schema>) {
  type Payload = z.infer<Schema>;

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

    if (disabled) return;

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

    for (const { extraValidation, id, errorMessages } of fields) {
      if (extraValidation == null) continue;

      const value = formData[id];
      const isValid = extraValidation({ value, payload: formData });
      if (isValid) continue;

      const errorMessage =
        errorMessages?.extra ??
        intl.formatMessage(messages.defaultFormValidationError);
      toast.error(errorMessage);
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
        {fields.map(
          ({
            id,
            placeholder,
            label,
            type,
            errorMessages,
            autoComplete,
            extraValidation,
          }) => {
            const idString = id as string;
            const value = formData[idString];
            const { isValid, errorMessage } = validateField({
              value: formData[idString],
              isFocused: focusedField === idString,
              schema: validators[idString],
              errorMessages,
              extraValidation,
              payload: formData,
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
                onChange={event => {
                  handleFieldChange(idString)(event.target.value);
                }}
                onFocus={() => setFocusedField(idString)}
                isInvalid={!isValid}
                invalidMessage={errorMessage}
                disabled={disabled}
                autoComplete={autoComplete}
              />
            );
          }
        )}
        <Flex mt="6" justify="end" gap="3" align="center">
          {secondaryButton != null ? (
            <Button
              variant="solid"
              type="button"
              onClick={secondaryButton.onClick}
            >
              {secondaryButton.label}
            </Button>
          ) : null}
          <Button variant="outline" type="submit" disabled={disabled}>
            {submitButtonText}
          </Button>
        </Flex>
      </Card>
    </form>
  );
}

function validateField<TargetValue, Payload extends Record<string, unknown>>({
  value,
  isFocused,
  schema,
  errorMessages,
  payload,
  extraValidation,
}: {
  value: TargetValue;
  isFocused: boolean;
  schema: z.ZodAny;
  payload: Payload;
  errorMessages?: Partial<Record<z.ZodIssueCode | 'extra', string>>;
  extraValidation?: ({
    value,
    payload,
  }: {
    value: unknown;
    payload: unknown;
  }) => boolean;
}): {
  isValid: boolean;
  errorMessage: string | null;
} {
  let isValid = isFocused || String(value).length === 0;
  let parseResult: z.SafeParseReturnType<unknown, unknown> | null = null;
  if (!isValid) {
    parseResult = schema.safeParse(value);
    isValid = parseResult.success;

    if (isValid && extraValidation != null && errorMessages != null) {
      isValid = extraValidation({ value, payload });
      if (!isValid) {
        const errorMessage = errorMessages['extra'];
        if (errorMessage != null) {
          return { isValid: false, errorMessage };
        }
      }
    }
  }

  if (errorMessages == null) return { isValid, errorMessage: null };

  if (isValid || parseResult == null) {
    return { isValid: true, errorMessage: null };
  }

  const extractedMessage =
    extractErrorMessagesFromValidationResult(parseResult);
  const errorCode = extractedMessage?.find(
    ({ code }) => errorMessages[code] != null
  )?.code;
  if (errorCode != null) {
    return { isValid: false, errorMessage: errorMessages[errorCode] ?? null };
  }

  return { isValid, errorMessage: null };
}

function extractErrorMessagesFromValidationResult(
  result: z.SafeParseReturnType<unknown, unknown>
) {
  const message = result.error?.message;
  if (message == null) return null;

  return JSON.parse(message) as Array<{
    code: z.ZodIssueCode | 'extra';
    path?: Array<string>;
  }>;
}

export default Form;
