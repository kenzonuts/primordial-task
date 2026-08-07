import type { ReactElement } from 'react';

import {
  evaluatePasswordStrength,
  type PasswordStrength as PasswordStrengthLevel,
} from '@features/auth/schemas/auth-schemas';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type PasswordStrengthProps = {
  readonly password: string;
  readonly className?: string;
};

const strengthLabels: Record<Exclude<PasswordStrengthLevel, 'empty'>, string> = {
  weak: 'Weak',
  acceptable: 'Acceptable',
  strong: 'Strong',
};

const strengthToFilledBars: Record<PasswordStrengthLevel, number> = {
  empty: 0,
  weak: 1,
  acceptable: 2,
  strong: 3,
};

export const PasswordStrength = ({
  password,
  className,
}: PasswordStrengthProps): ReactElement | null => {
  const strength = evaluatePasswordStrength(password);

  if (strength === 'empty') {
    return null;
  }

  const filled = strengthToFilledBars[strength];

  return (
    <Stack gap={8} className={cn(className)} aria-live="polite">
      <Inline gap={4} align="center" className="w-full" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            className={cn(
              'h-[4px] flex-1 rounded-full bg-state-skeleton',
              index < filled && 'bg-gray-300',
              index < filled && strength === 'strong' && 'bg-gray-100',
              index < filled && strength === 'acceptable' && 'bg-gray-400',
              index < filled && strength === 'weak' && 'bg-gray-500',
            )}
          />
        ))}
      </Inline>
      <Text as="p" variant="caption" muted>
        {strengthLabels[strength]}
      </Text>
    </Stack>
  );
};

export type { PasswordStrengthProps };
