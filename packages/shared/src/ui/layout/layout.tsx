import type { CSSProperties, ReactNode } from 'react';

import { cn } from '@ui/lib/cn';

type Align = 'stretch' | 'start' | 'center' | 'end' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around';

const alignClass: Record<Align, string> = {
  stretch: 'items-stretch',
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
};

const justifyClass: Record<Justify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

const gapClass: Record<number, string> = {
  0: 'gap-0',
  1: 'gap-0.5',
  2: 'gap-0.5',
  4: 'gap-1',
  8: 'gap-2',
  12: 'gap-3',
  16: 'gap-4',
  20: 'gap-5',
  24: 'gap-6',
  32: 'gap-8',
};

export type Gap = keyof typeof gapClass | number;

const toGap = (gap: Gap): string => {
  if (typeof gap === 'number') {
    return gapClass[gap] ?? '';
  }

  return gapClass[gap] ?? '';
};

interface StackProps {
  children: ReactNode;
  gap?: Gap;
  align?: Align;
  justify?: Justify;
  className?: string;
  as?: 'div' | 'section' | 'main';
  style?: CSSProperties;
}

export const Stack = ({
  children,
  gap = 16,
  align = 'stretch',
  justify = 'start',
  className,
  as: Component = 'div',
  style,
}: StackProps): ReactNode => {
  return (
    <Component
      className={cn(
        'flex flex-col',
        alignClass[align],
        justifyClass[justify],
        toGap(gap),
        className,
      )}
      style={style}
    >
      {children}
    </Component>
  );
};

interface InlineProps extends Omit<StackProps, 'as'> {
  wrap?: boolean;
}

export const Inline = ({
  children,
  gap = 8,
  align = 'center',
  className,
  wrap = false,
  style,
}: InlineProps): ReactNode => {
  return (
    <div
      className={cn(
        'flex flex-row',
        alignClass[align],
        justifyClass[align === 'baseline' ? 'start' : 'start'],
        toGap(gap),
        wrap && 'flex-wrap',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
}

export const Container = ({
  children,
  className,
  maxWidth = '1280px',
}: ContainerProps): ReactNode => {
  return (
    <div className={cn('mx-auto w-full px-6', className)} style={{ maxWidth }}>
      {children}
    </div>
  );
};

interface GridProps {
  children: ReactNode;
  columns?: number;
  gap?: Gap;
  className?: string;
}

export const Grid = ({ children, columns, gap = 16, className }: GridProps): ReactNode => {
  return (
    <div
      className={cn('grid', toGap(gap), className)}
      style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
    >
      {children}
    </div>
  );
};

interface FlexProps {
  children: ReactNode;
  flex?: string;
  className?: string;
}

export const Flex = ({ children, flex = 'none', className }: FlexProps): ReactNode => {
  return (
    <div className={cn('flex', className)} style={{ flex }}>
      {children}
    </div>
  );
};

interface SpacerProps {
  size?: number;
  flex?: string;
}

export const Spacer = ({ size, flex }: SpacerProps): ReactNode => {
  const style: CSSProperties = flex ? { flex } : size ? { height: size, width: '100%' } : {};

  return <div aria-hidden className="shrink-0" style={style} />;
};

export const Divider = ({ className }: { className?: string }): ReactNode => {
  return <hr className={cn('h-px w-full border-0 bg-divider', className)} />;
};

export const ScrollArea = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}): ReactNode => {
  return <div className={cn('overflow-auto', className)}>{children}</div>;
};

interface SurfaceProps {
  children: ReactNode;
  tone?: 'base' | 'elevated' | 'card' | 'sidebar' | 'nav' | 'input';
  border?: boolean;
  className?: string;
}

const surfaceTone: Record<NonNullable<SurfaceProps['tone']>, string> = {
  base: 'bg-surface',
  elevated: 'bg-elevated',
  card: 'bg-card',
  sidebar: 'bg-sidebar',
  nav: 'bg-nav',
  input: 'bg-input',
};

export const Surface = ({
  children,
  tone = 'base',
  border = false,
  className,
}: SurfaceProps): ReactNode => {
  return (
    <div className={cn(surfaceTone[tone], border && 'border border-border-default', className)}>
      {children}
    </div>
  );
};
