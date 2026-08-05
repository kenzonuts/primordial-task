import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly loading?: boolean;
  readonly leadingIcon?: ReactNode;
  readonly trailingIcon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-gray-100 text-gray-950 hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-300/50 disabled:text-gray-600',
  secondary:
    'border border-border-default bg-transparent text-text-primary hover:bg-hover active:bg-pressed disabled:text-text-disabled',
  ghost:
    'bg-transparent text-text-secondary hover:bg-hover hover:text-text-primary active:bg-pressed disabled:text-text-disabled',
  destructive:
    'bg-danger-bg text-danger border border-transparent hover:border-danger/60 active:bg-danger/20 disabled:text-text-disabled',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs',
  md: 'h-8 px-3.5 text-[13px]',
  lg: 'h-10 px-[18px] text-sm',
};

export const Button = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  className,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps): ReactNode => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex min-h-8 items-center justify-center gap-2 rounded-md font-[560] transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-app disabled:pointer-events-none',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leadingIcon
      )}
      <span>{children}</span>
      {!loading && trailingIcon}
    </button>
  );
};

interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  readonly label: string;
  readonly icon: ReactNode;
}

export const IconButton = ({
  label,
  icon,
  className,
  size = 'md',
  variant = 'ghost',
  ...rest
}: IconButtonProps): ReactNode => {
  const boxClass = size === 'sm' ? 'h-7 w-7 p-0' : size === 'lg' ? 'h-9 w-9 p-0' : 'h-8 w-8 p-0';

  return (
    <Button
      aria-label={label}
      title={label}
      size={size}
      variant={variant}
      className={cn(boxClass, className)}
      {...rest}
    >
      {icon}
    </Button>
  );
};
