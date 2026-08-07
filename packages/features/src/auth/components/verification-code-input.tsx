import {
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactElement,
} from 'react';

import { ValidationMessage } from '@features/auth/components/validation-message';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

const CODE_LENGTH = 6;

type VerificationCodeInputProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly error?: string | null;
  readonly label?: string;
  readonly className?: string;
  readonly autoFocus?: boolean;
};

const sanitizeCode = (raw: string): string => raw.replace(/\D/g, '').slice(0, CODE_LENGTH);

export const VerificationCodeInput = ({
  value,
  onChange,
  disabled = false,
  error,
  label = 'Verification code',
  className,
  autoFocus = false,
}: VerificationCodeInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const errorId = useId();
  const digits = value.padEnd(CODE_LENGTH, ' ').slice(0, CODE_LENGTH).split('');
  const activeIndex = Math.min(value.length, CODE_LENGTH - 1);

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputRef.current?.focus();
    }
  }, [autoFocus, disabled]);

  const focusInput = (): void => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(sanitizeCode(event.target.value));
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>): void => {
    event.preventDefault();
    onChange(sanitizeCode(event.clipboardData.getData('text')));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Backspace' && value.length === 0) {
      event.preventDefault();
    }
  };

  return (
    <Stack gap={8} className={cn('w-full', className)}>
      <Text as="label" id={labelId} variant="label" className="text-text-secondary">
        {label}
      </Text>

      <div className="relative" role="group" aria-labelledby={labelId}>
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={CODE_LENGTH}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
          aria-label={label}
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0 disabled:cursor-not-allowed"
        />

        <Inline
          gap={8}
          align="center"
          justify="between"
          className="w-full"
          onClick={focusInput}
          aria-hidden="true"
        >
          {digits.map((digit, index) => {
            const isFilled = digit !== ' ';
            const isActive = !disabled && index === activeIndex;

            return (
              <span
                key={index}
                className={cn(
                  [
                    'flex size-[44px] shrink-0 items-center justify-center rounded-md border',
                    'bg-surface-input text-sm font-medium text-text-primary',
                    'ds-transition-fast',
                  ],
                  error ? 'border-danger' : 'border-border-default',
                  isActive && !error && 'border-border-strong',
                  isActive && 'outline-2 outline-offset-2 outline-[var(--state-focus)]',
                  disabled && 'opacity-[var(--opacity-disabled)]',
                )}
              >
                {isFilled ? digit : ''}
              </span>
            );
          })}
        </Inline>
      </div>

      {error ? (
        <ValidationMessage id={errorId} tone="error">
          {error}
        </ValidationMessage>
      ) : null}
    </Stack>
  );
};

export type { VerificationCodeInputProps };
