import { ArrowLeft } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { BrandSection } from '@features/auth/components/brand-section';
import { Icon } from '@shared/ui/icons/icon';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type AuthHeaderProps = {
  readonly title: ReactNode;
  readonly description?: ReactNode;
  readonly onBack?: () => void;
  readonly backLabel?: string;
  readonly showBrand?: boolean;
  readonly className?: string;
};

export const AuthHeader = ({
  title,
  description,
  onBack,
  backLabel = 'Back',
  showBrand = true,
  className,
}: AuthHeaderProps): ReactElement => {
  return (
    <Stack gap={12} className={cn('w-full max-w-[360px]', className)}>
      {onBack ? (
        <Button
          type="button"
          variant="ghost"
          size="md"
          className="-ml-3 w-fit justify-start px-3"
          onClick={onBack}
          leftIcon={<Icon icon={ArrowLeft} size="default" decorative />}
        >
          {backLabel}
        </Button>
      ) : null}

      {showBrand ? <BrandSection size="md" /> : null}

      <Stack gap={12}>
        <Heading level={1} className="text-[22px] leading-[30px] font-[620]">
          {title}
        </Heading>
        {description ? (
          <Text as="p" variant="body-md" className="text-text-secondary">
            {description}
          </Text>
        ) : null}
      </Stack>
    </Stack>
  );
};

export type { AuthHeaderProps };
