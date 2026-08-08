import type { FormEvent, ReactElement } from 'react';
import { useState } from 'react';

import { commentBodySchema } from '@features/notes/schemas/note-schemas';
import { Stack } from '@shared/ui/layout/stack';
import { Button } from '@shared/ui/primitives/button';
import { Textarea } from '@shared/ui/primitives/textarea';
import { Text } from '@shared/ui/typography/text';

type CommentComposerProps = {
  readonly onSubmit: (body: string) => void | Promise<void>;
  readonly placeholder?: string;
  readonly submitLabel?: string;
  readonly disabled?: boolean;
  readonly className?: string;
};

export const CommentComposer = ({
  onSubmit,
  placeholder = 'Add a comment…',
  submitLabel = 'Comment',
  disabled = false,
  className,
}: CommentComposerProps): ReactElement => {
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const parsed = commentBodySchema.safeParse(body);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a comment.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onSubmit(parsed.data);
      setBody('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className={className}>
      <Stack gap={8}>
        <Textarea
          value={body}
          disabled={disabled || busy}
          placeholder={placeholder}
          aria-label="Comment"
          aria-invalid={error != null}
          rows={3}
          onChange={(event) => {
            setBody(event.target.value);
            setError(null);
          }}
        />
        {error ? (
          <Text as="p" variant="caption" className="text-danger" role="alert">
            {error}
          </Text>
        ) : null}
        <Button type="submit" size="sm" disabled={disabled} loading={busy} className="self-end">
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
};

export type { CommentComposerProps };
