'use client';

import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

import TextField from '@/components/text-field';
import { Button, Flex } from '@radix-ui/themes';

import formSchema, { formRegisterOptions } from './schema';
import type { FormSchema } from './schema';

import styles from './add-contact-form.module.sass';

function AddContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: {
      first_name: '',
      last_name: '',
    },
  });

  const onSubmit: SubmitHandler<FormSchema> = data => {
    console.log(formSchema.parse(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction="column" justify="center">
        <Flex direction="row" gap="2" justify="center">
          <TextField
            placeholder="First"
            id="first_name"
            invalidMessage={'Invalid first name'}
            isInvalid={errors.first_name != null}
            {...register('first_name', formRegisterOptions.first_name)}
          />
          <TextField
            placeholder="Last"
            id="last_name"
            invalidMessage={'Invalid last name'}
            isInvalid={errors.last_name != null}
            {...register('last_name', formRegisterOptions.last_name)}
          />
        </Flex>
        <div className={styles['submit-button-wrapper']}>
          <Button type="submit">Submit</Button>
        </div>
      </Flex>
    </form>
  );
}

export default AddContactForm;
