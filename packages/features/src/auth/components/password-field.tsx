import { Eye, EyeOff } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { PasswordStrength } from '@features/auth/components/password-strength';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@shared/ui/forms/form';
import { Icon } from '@shared/ui/icons/icon';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Input } from '@shared/ui/primitives/input';

type PasswordFieldProps = {
  readonly name: string;
  readonly label: string;
  readonly autoComplete: 'current-password' | 'new-password';
  readonly showStrength?: boolean;
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly className?: string;
};

export const PasswordField = ({
  name,
  label,
  autoComplete,
  showStrength = false,
  placeholder,
  disabled = false,
  className,
}: PasswordFieldProps): ReactElement => {
  const { control } = useFormContext();
  const [visible, setVisible] = useState(false);
  const passwordValue = useWatch({ control, name }) as string | undefined;
  const toggleLabel = visible ? 'Hide password' : 'Show password';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn(className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={visible ? 'text' : 'password'}
              autoComplete={autoComplete}
              placeholder={placeholder}
              size="lg"
              disabled={disabled}
              error={Boolean(fieldState.error)}
              trailing={
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={toggleLabel}
                        aria-pressed={visible}
                        disabled={disabled}
                        onClick={() => setVisible((current) => !current)}
                      >
                        <Icon icon={visible ? EyeOff : Eye} size="default" decorative />
                      </IconButton>
                    </TooltipTrigger>
                    <TooltipContent side="top">{toggleLabel}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              }
            />
          </FormControl>
          {showStrength ? (
            <PasswordStrength password={passwordValue ?? field.value ?? ''} className="mt-8" />
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export type { PasswordFieldProps };
