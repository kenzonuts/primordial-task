import { X } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent, type ReactElement } from 'react';

import { tagNameSchema } from '@features/notes/schemas/note-schemas';
import type { NoteTag } from '@features/notes/types';
import { Inline } from '@shared/ui/layout/inline';
import { cn } from '@shared/ui/lib/cn';
import { Badge } from '@shared/ui/primitives/badge';
import { Button } from '@shared/ui/primitives/button';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Input } from '@shared/ui/primitives/input';
import { Text } from '@shared/ui/typography/text';

export type TagSelectorProps = {
  readonly tags: readonly NoteTag[];
  readonly onChange: (tags: readonly NoteTag[]) => void;
  readonly suggestions?: readonly string[];
  readonly disabled?: boolean;
  readonly className?: string;
};

export const TagSelector = ({
  tags,
  onChange,
  suggestions = [],
  disabled = false,
  className,
}: TagSelectorProps): ReactElement => {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const addTag = (raw: string): void => {
    const parsed = tagNameSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid tag.');
      return;
    }
    const name = parsed.data.toLowerCase();
    if (tags.some((tag) => tag.name.toLowerCase() === name)) {
      setError('Tag already added.');
      return;
    }
    setError(null);
    setDraft('');
    onChange([...tags, { id: `tag-${name}`, name }]);
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    if (!draft.trim()) {
      return;
    }
    addTag(draft.trim());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (draft.trim()) {
        addTag(draft.trim());
      }
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Inline gap={8} wrap className="items-center">
        {tags.map((tag) => (
          <Badge key={tag.id} variant="neutral" size="sm" className="gap-1 pr-1">
            #{tag.name}
            <IconButton
              type="button"
              size="sm"
              variant="ghost"
              disabled={disabled}
              aria-label={`Remove tag ${tag.name}`}
              onClick={() => {
                onChange(tags.filter((item) => item.id !== tag.id));
              }}
            >
              <X aria-hidden="true" className="size-3" />
            </IconButton>
          </Badge>
        ))}
      </Inline>

      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          value={draft}
          disabled={disabled}
          placeholder="Add tag"
          aria-label="Add tag"
          onChange={(event) => {
            setDraft(event.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" variant="secondary" size="sm" disabled={disabled || !draft.trim()}>
          Add
        </Button>
      </form>

      {error ? (
        <Text variant="caption" className="text-danger">
          {error}
        </Text>
      ) : null}

      {suggestions.length > 0 ? (
        <Inline gap={6} wrap>
          {suggestions
            .filter((name) => !tags.some((tag) => tag.name === name))
            .slice(0, 8)
            .map((name) => (
              <Button
                key={name}
                type="button"
                size="sm"
                variant="ghost"
                disabled={disabled}
                onClick={() => {
                  addTag(name);
                }}
              >
                #{name}
              </Button>
            ))}
        </Inline>
      ) : null}
    </div>
  );
};
