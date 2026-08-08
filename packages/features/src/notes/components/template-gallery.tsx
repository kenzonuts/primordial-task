import type { ReactElement } from 'react';

import { NOTE_TYPE_LABELS } from '@features/notes/constants';
import type { NoteTemplate } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type TemplateGalleryProps = {
  readonly templates: readonly NoteTemplate[];
  readonly onUseTemplate?: (template: NoteTemplate) => void;
  readonly selectedTemplateId?: string | null;
  readonly className?: string;
};

export const TemplateGallery = ({
  templates,
  onUseTemplate,
  selectedTemplateId = null,
  className,
}: TemplateGalleryProps): ReactElement => {
  if (templates.length === 0) {
    return (
      <Text variant="body-sm" muted className={cn('p-6 text-center', className)}>
        No templates available.
      </Text>
    );
  }

  const byCategory = new Map<string, NoteTemplate[]>();
  for (const template of templates) {
    const bucket = byCategory.get(template.category) ?? [];
    bucket.push(template);
    byCategory.set(template.category, bucket);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {[...byCategory.entries()].map(([category, items]) => (
        <section key={category} aria-label={category}>
          <Text variant="caption" muted className="mb-2 uppercase tracking-wide font-medium">
            {category}
          </Text>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((template) => {
              const selected = selectedTemplateId === template.id;
              return (
                <article
                  key={template.id}
                  className={cn(
                    'flex flex-col gap-2 rounded-md border border-border-subtle bg-surface-elevated p-3',
                    selected && 'border-border-default bg-state-selected',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <Text as="h3" variant="body-sm" className="font-medium">
                      {template.name}
                    </Text>
                    <Badge variant="neutral" size="sm" className="shrink-0 text-[10px]">
                      {NOTE_TYPE_LABELS[template.noteType]}
                    </Badge>
                  </div>
                  <Text as="p" variant="caption" muted className="line-clamp-3 flex-1">
                    {template.description}
                  </Text>
                  {onUseTemplate ? (
                    <Button
                      type="button"
                      size="sm"
                      variant={selected ? 'secondary' : 'ghost'}
                      className="mt-1 self-start"
                      onClick={() => onUseTemplate(template)}
                    >
                      Use template
                    </Button>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export type { TemplateGalleryProps };
