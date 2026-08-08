import type { ReactElement } from 'react';

import type { NoteSortKey } from '@features/notes/types';
import { NOTE_SORT_KEYS } from '@features/notes/types';
import { cn } from '@shared/ui/lib/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';

const SORT_LABELS: Record<NoteSortKey, string> = {
  updated: 'Last updated',
  created: 'Date created',
  title: 'Title',
  favorites: 'Favorites',
  pinned: 'Pinned',
};

type NoteSortProps = {
  readonly value: NoteSortKey;
  readonly onChange: (sort: NoteSortKey) => void;
  readonly className?: string;
  readonly disabled?: boolean;
};

export const NoteSort = ({
  value,
  onChange,
  className,
  disabled = false,
}: NoteSortProps): ReactElement => {
  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={(next) => {
        if ((NOTE_SORT_KEYS as readonly string[]).includes(next)) {
          onChange(next as NoteSortKey);
        }
      }}
    >
      <SelectTrigger aria-label="Sort notes" className={cn('h-8 w-[160px]', className)} size="sm">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        {NOTE_SORT_KEYS.map((key) => (
          <SelectItem key={key} value={key}>
            {SORT_LABELS[key]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export type { NoteSortProps };
