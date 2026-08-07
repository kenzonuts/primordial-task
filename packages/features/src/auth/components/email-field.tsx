import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/forms/form';
import { cn } from '@shared/ui/lib/cn';
import { Input } from '@shared/ui/primitives/input';

type EmailFieldProps = {
  readonly label?: string;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly autoFocus?: boolean;
};

export const EmailField = ({
  label = 'Email',
  placeholder = 'you@company.com',
  disabled = false,
  className,
  autoFocus = false,
}: EmailFieldProps): ReactElement => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="email"
      render={({ field, fieldState }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={placeholder}
              size="lg"
              disabled={disabled}
              autoFocus={autoFocus}
              error={Boolean(fieldState.error)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export type { EmailFieldProps };
