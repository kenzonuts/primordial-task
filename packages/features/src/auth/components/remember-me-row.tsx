import type { CheckedState } from '@radix-ui/react-checkbox';
import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Checkbox } from '@shared/ui/primitives/checkbox';
import { Text } from '@shared/ui/typography/text';

type RememberMeRowProps = {
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
  readonly onForgotPassword: () => void;
  readonly className?: string;
  readonly rememberLabel?: string;
  readonly forgotLabel?: string;
  readonly disabled?: boolean;
};

export const RememberMeRow = ({
  checked,
  onCheckedChange,
  onForgotPassword,
  className,
  rememberLabel = 'Remember Me',
  forgotLabel = 'Forgot your password?',
  disabled = false,
}: RememberMeRowProps): ReactElement => {
  const handleCheckedChange = (value: CheckedState): void => {
    onCheckedChange(value === true);
  };

  return (
    <Inline justify="between" align="center" gap={12} className={cn('mt-4 w-full', className)}>
      <Inline gap={4} align="center" className="min-w-0">
        <Checkbox
          id="auth-remember-me"
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          aria-label={rememberLabel}
        />
        <Text
          as="label"
          htmlFor="auth-remember-me"
          variant="body-sm"
          className="cursor-pointer select-none text-text-secondary"
        >
          {rememberLabel}
        </Text>
      </Inline>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        onClick={onForgotPassword}
        className="h-auto shrink-0 px-2 py-1 text-text-secondary hover:text-text-primary"
      >
        {forgotLabel}
      </Button>
    </Inline>
  );
};

export type { RememberMeRowProps };
