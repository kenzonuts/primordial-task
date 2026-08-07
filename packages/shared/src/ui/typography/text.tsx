import type { ComponentPropsWithoutRef, ElementType, ReactElement, ReactNode } from 'react';

import { cn } from '@shared/ui/lib/cn';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption'
  | 'label'
  | 'button'
  | 'mono';

const textVariantClasses: Record<TextVariant, string> = {
  display: 'font-sans text-[32px] leading-[40px] font-[650] tracking-normal',
  h1: 'font-sans text-[26px] leading-[34px] font-[650] tracking-normal',
  h2: 'font-sans text-[22px] leading-[30px] font-[620] tracking-normal',
  h3: 'font-sans text-[18px] leading-[26px] font-[600] tracking-normal',
  h4: 'font-sans text-[15px] leading-[22px] font-[600] tracking-normal',
  'body-lg': 'font-sans text-[16px] leading-[24px] font-[450] tracking-normal',
  'body-md': 'font-sans text-[14px] leading-[22px] font-[450] tracking-normal',
  'body-sm': 'font-sans text-[13px] leading-[20px] font-[450] tracking-normal',
  caption: 'font-sans text-[12px] leading-[18px] font-[450] tracking-normal',
  label: 'font-sans text-[12px] leading-[16px] font-[560] tracking-normal',
  button: 'font-sans text-[13px] leading-[16px] font-[560] tracking-normal',
  mono: 'font-mono text-[13px] leading-[20px] font-[450] tracking-normal',
};

type TextOwnProps<E extends ElementType> = {
  readonly as?: E;
  readonly variant?: TextVariant;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly muted?: boolean;
  readonly truncate?: boolean;
};

export type TextProps<E extends ElementType = 'span'> = TextOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps<E>>;

export const Text = <E extends ElementType = 'span'>({
  as,
  variant = 'body-md',
  className,
  children,
  muted = false,
  truncate = false,
  ...rest
}: TextProps<E>): ReactElement => {
  const Component = as ?? 'span';

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

export { textVariantClasses };
