import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

import { cn } from '@shared/ui/lib/cn';

const Accordion = AccordionPrimitive.Root;

type AccordionItemProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

const AccordionItem = ({ className, ...props }: AccordionItemProps): ReactElement => {
  return (
    <AccordionPrimitive.Item
      className={cn('border-b border-border-subtle', className)}
      {...props}
    />
  );
};

type AccordionTriggerProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionTriggerProps): ReactElement => {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-center justify-between gap-3 py-3 text-left text-sm font-medium',
          'text-text-primary ds-transition-fast outline-none hover:text-text-primary',
          'focus-visible:ds-focus-ring [&[data-state=open]>svg]:rotate-180',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className="size-4 shrink-0 text-text-muted ds-transition-base"
          aria-hidden="true"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
};

type AccordionContentProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionContentProps): ReactElement => {
  return (
    <AccordionPrimitive.Content
      className={cn(
        'overflow-hidden text-sm text-text-secondary',
        'data-[state=closed]:animate-none data-[state=open]:ds-fade-in',
        className,
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  );
};

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionItemProps, AccordionTriggerProps, AccordionContentProps };
