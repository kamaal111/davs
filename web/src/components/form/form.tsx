import React from 'react';
import { FormattedMessage, useIntl, type MessageDescriptor } from 'react-intl';
import type { z } from 'zod';
import { Card, Heading, Text } from '@radix-ui/themes';

import TextField from '../text-field';
import useInputsStates from '@/common/hooks/use-inputs-states';

function Form({
  schema,
  fields,
  header,
}: {
  header: MessageDescriptor;
  schema: z.infer<z.AnyZodObject>;
  fields: Array<{
    id: string;
    placeholder: MessageDescriptor;
    label: MessageDescriptor;
    type?: Parameters<typeof TextField>[0]['type'];
  }>;
}) {
  const fieldIds = fields.map(field => field.id);

  const [formData, setFormData] = React.useState<typeof schema>(
    fieldIds.reduce(
      (acc, current) => {
        return { ...acc, [current]: '' };
      },
      {} as typeof schema
    )
  );

  const { inputRefs } = useInputsStates({
    events: ['blur', 'focus'],
    keys: fieldIds,
  });

  const intl = useIntl();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleFieldChange(key: keyof typeof schema) {
    return (value: string) => {
      setFormData({ ...formData, [key]: value });
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card size="4">
        <Heading as="h3" size="6" trim="start" mb="5">
          <FormattedMessage {...header} />
        </Heading>
        {fields.map(({ id, placeholder, label, type }) => {
          const idString = id as string;

          return (
            <TextField
              ref={ref => {
                inputRefs.current[idString] = ref;
              }}
              key={idString}
              value={formData[idString]}
              placeholder={intl.formatMessage(placeholder)}
              id={idString}
              type={type}
              label={() => (
                <Text as="label" htmlFor={idString} size="2" weight="bold">
                  <FormattedMessage {...label} />
                </Text>
              )}
              onChange={handleFieldChange(idString)}
            />
          );
        })}
      </Card>
    </form>
  );
}

export default Form;
