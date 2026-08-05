import type { ElementType, ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

type TypographyKey =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body-large'
  | 'body-medium'
  | 'body-small'
  | 'caption'
  | 'label'
  | 'button'
  | 'mono';

type TextTone = 'primary' | 'secondary' | 'muted' | 'disabled';
type TextAlign = 'left' | 'center' | 'right';

interface TextProps {
  as?: ElementType;
  variant?: TypographyKey;
  tone?: TextTone;
  align?: TextAlign;
  truncate?: boolean;
  className?: string;
  children: ReactNode;
  id?: string;
}

const toneStyles: Record<TextTone, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
  disabled: 'text-text-disabled',
};

export const BaseText = ({
  as: Component = 'span',
  variant = 'body-medium',
  tone = 'primary',
  align = 'left',
  truncate = false,
  className,
  children,
  ...rest
}: TextProps): ReactNode => {
  const variantStyles: Record<TypographyKey, string> = {
    display: 'text-[32px] leading-[40px] font-[650]',
    h1: 'text-[26px] leading-[34px] font-[650]',
    h2: 'text-[22px] leading-[30px] font-[620]',
    h3: 'text-[18px] leading-[26px] font-[600]',
    h4: 'text-[15px] leading-[22px] font-[600]',
    'body-large': 'text-[16px] leading-6 font-[450]',
    'body-medium': 'text-sm leading-[22px] font-[450]',
    'body-small': 'text-[13px] leading-5 font-[450]',
    caption: 'text-xs leading-[18px] font-[450]',
    label: 'text-xs leading-4 font-[560]',
    button: 'text-[13px] leading-4 font-[560]',
    mono: 'font-mono text-[13px] leading-5 font-[450]',
  };

  const monoClasses = variant === 'mono' ? 'font-mono' : 'font-sans';

  return (
    <Component
      id={rest.id}
      className={cn(
        monoClasses,
        variantStyles[variant],
        toneStyles[tone],
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        truncate && 'truncate',
        className,
      )}
    >
      {children}
    </Component>
  );
};

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  variant?: TypographyKey;
}

export const Heading = ({ as = 'h1', variant, ...rest }: HeadingProps): ReactNode => {
  const resolvedVariant = (variant ?? as) as TypographyKey;

  return <BaseText as={as} variant={resolvedVariant} {...rest} />;
};

export const Display = (props: HeadingProps): ReactNode => (
  <BaseText {...props} variant="display" />
);

export const Text = BaseText;
