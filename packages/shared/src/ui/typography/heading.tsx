import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';
import { textVariantClasses } from '@shared/ui/typography/text';
import type { TextVariant } from '@shared/ui/typography/text';

export type HeadingLevel = 1 | 2 | 3 | 4;

const levelToVariant: Record<HeadingLevel, TextVariant> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

const levelToDefaultElement: Record<HeadingLevel, 'h1' | 'h2' | 'h3' | 'h4'> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
};

type HeadingOwnProps<E extends ElementType> = {
  readonly as?: E;
  readonly level?: HeadingLevel;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly muted?: boolean;
  readonly truncate?: boolean;
};

export type HeadingProps<E extends ElementType = 'h2'> = HeadingOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof HeadingOwnProps<E>>;

export const Heading = <E extends ElementType = 'h2'>({
  as,
  level = 2,
  className,
  children,
  muted = false,
  truncate = false,
  ...rest
}: HeadingProps<E>): ReactElement => {
  const Component = as ?? levelToDefaultElement[level];
  const variant = levelToVariant[level];

  return (
    <Component
      className={cn(
        textVariantClasses[variant],
        'text-text-primary',
        muted && 'text-text-muted',
        truncate && 'truncate',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
};
