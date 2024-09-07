import type { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/client/components/ui/form';
import { Input } from '@/client/components/ui/input';
import { Button } from '@/client/components/ui/button';

import LoginPayload from '@/common/users/validators/login-payload';

import './login-form.css';

function LoginForm() {
  const form = useForm({
    resolver: zodResolver(LoginPayload),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof LoginPayload>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const fields: Array<keyof z.infer<typeof LoginPayload>> = [
    'username',
    'password',
  ];
  const fieldConfigs: Record<
    (typeof fields)[number],
    {
      label: string;
      type?: React.HTMLInputTypeAttribute;
      placeholder: string;
      description?: string;
      autoComplete?: React.HTMLInputAutoCompleteAttribute;
    }
  > = {
    username: {
      label: 'Username',
      placeholder: 'Username',
      autoComplete: 'username',
    },
    password: {
      label: 'Password',
      type: 'password',
      placeholder: 'Password',
      autoComplete: 'current-password',
    },
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.map(fieldKey => {
          const config = fieldConfigs[fieldKey];

          return (
            <FormField
              key={fieldKey}
              control={form.control}
              name={fieldKey}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label">{config.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={config.placeholder}
                      type={config.type}
                      autoComplete={config.autoComplete}
                      {...field}
                    />
                  </FormControl>
                  {config.description ? (
                    <FormDescription className="description">
                      {config.description}
                    </FormDescription>
                  ) : null}

                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <div className="submit-button">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
