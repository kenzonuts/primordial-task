import type { ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

type ProjectCoverSize = 'sm' | 'md' | 'lg';

type ProjectCoverProps = {
  readonly color: string;
  readonly coverUrl?: string;
  readonly size?: ProjectCoverSize;
  readonly className?: string;
  readonly alt?: string;
};

const HEIGHT_BY_SIZE: Record<ProjectCoverSize, string> = {
  sm: 'h-10',
  md: 'h-16',
  lg: 'h-28',
};

export const ProjectCover = ({
  color,
  coverUrl,
  size = 'md',
  className,
  alt = '',
}: ProjectCoverProps): ReactElement => {
  if (coverUrl) {
    return (
      <div
        className={cn(
          'w-full overflow-hidden rounded-t-lg bg-surface-elevated',
          HEIGHT_BY_SIZE[size],
          className,
        )}
        style={{ backgroundColor: color }}
      >
        <img src={coverUrl} alt={alt} className="size-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn('w-full rounded-t-lg', HEIGHT_BY_SIZE[size], className)}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
  );
};

export type { ProjectCoverProps, ProjectCoverSize };
