import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactElement, Ref, TextareaHTMLAttributes } from 'react';

import { cn } from '@shared/ui/lib/cn';

const textareaVariants = cva(
  [
    'flex w-full min-w-0 resize-y rounded-md border bg-surface-input px-[12px] py-[8px]',
    'text-text-primary placeholder:text-text-placeholder',
    'ds-transition-fast',
    'focus-visible:outline-none focus-visible:border-border-strong',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--state-focus)]',
    'disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)]',
  ],
  {
    variants: {
      size: {
        compact: 'min-h-[96px] text-sm leading-[22px]',
        standard: 'min-h-[144px] text-sm leading-[22px]',
        large: 'min-h-[240px] text-sm leading-[22px]',
      },
      mono: {
        true: 'font-mono text-[13px] leading-5',
        false: 'font-sans',
      },
      error: {
        true: 'border-danger focus-visible:border-danger',
        false: 'border-border-default',
      },
    },
    defaultVariants: {
      size: 'standard',
      mono: false,
      error: false,
    },
  },
);

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants> & {
    readonly ref?: Ref<HTMLTextAreaElement>;
  };

export const Textarea = ({
  className,
  size,
  mono = false,
  error = false,
  'aria-invalid': ariaInvalid,
  ref,
  ...props
}: TextareaProps): ReactElement => {
  const isInvalid = Boolean(error) || ariaInvalid === true || ariaInvalid === 'true';

  return (
    <textarea
      ref={ref}
      aria-invalid={isInvalid || undefined}
      className={cn(textareaVariants({ size, mono, error: isInvalid }), className)}
      {...props}
    />
  );
};

export { textareaVariants };
export type { TextareaProps };
