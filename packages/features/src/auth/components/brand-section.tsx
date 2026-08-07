import { Hexagon } from 'lucide-react';
import type { ReactElement } from 'react';

import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type BrandSize = 'sm' | 'md' | 'lg';

type BrandSectionProps = {
  readonly size?: BrandSize;
  readonly showName?: boolean;
  readonly tagline?: string;
  readonly className?: string;
};

const logoPixels: Record<BrandSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
};

const nameVariant: Record<BrandSize, 'h4' | 'h3' | 'h2'> = {
  sm: 'h4',
  md: 'h3',
  lg: 'h2',
};

export const BrandSection = ({
  size = 'md',
  showName = true,
  tagline,
  className,
}: BrandSectionProps): ReactElement => {
  const logoSize = logoPixels[size];

  return (
    <Stack gap={tagline ? 8 : 12} align="center" className={cn(className)}>
      <Inline gap={12} align="center">
        <Hexagon
          size={logoSize}
          strokeWidth={1.5}
          aria-hidden="true"
          className="shrink-0 text-text-primary"
        />
        {showName ? (
          <Text as="span" variant={nameVariant[size]}>
            Primordial Task
          </Text>
        ) : null}
      </Inline>
      {tagline ? (
        <Text as="p" variant={size === 'lg' ? 'body-md' : 'body-sm'} muted className="text-center">
          {tagline}
        </Text>
      ) : null}
    </Stack>
  );
};

export type { BrandSectionProps, BrandSize };
