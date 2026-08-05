import type { ImgHTMLAttributes, ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  readonly name: string;
  readonly src?: string;
  readonly size?: AvatarSize;
  readonly status?: 'online' | 'away' | 'busy' | 'none';
}

const sizeClass: Record<AvatarSize, string> = {
  xs: 'h-5 w-5 text-[10px]',
  sm: 'h-6 w-6 text-[11px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

const statusClass: Record<NonNullable<AvatarProps['status']>, string> = {
  none: 'hidden',
  online: 'bg-success',
  away: 'bg-warning',
  busy: 'bg-danger',
};

const initialsFromName = (name: string): string => {
  const tokens = name.trim().split(/\s+/);
  const first = tokens[0]?.[0] ?? 'U';
  const second = tokens[1]?.[0] ?? '';

  return `${first}${second}`.toUpperCase();
};

export const Avatar = ({
  name,
  src,
  size = 'md',
  status = 'none',
  className,
  alt,
  ...rest
}: AvatarProps): ReactNode => {
  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center',
        sizeClass[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name}
          className="h-full w-full rounded-full border border-border-default object-cover"
          {...rest}
        />
      ) : (
        <span className="inline-flex h-full w-full items-center justify-center rounded-full border border-border-default bg-hover font-[560] text-text-primary">
          {initialsFromName(name)}
        </span>
      )}
      <span
        aria-hidden
        className={cn(
          'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-app',
          statusClass[status],
        )}
      />
    </div>
  );
};
