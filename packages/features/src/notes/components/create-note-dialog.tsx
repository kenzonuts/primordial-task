import { useEffect, useId, useRef, useState, type FormEvent, type ReactElement } from 'react';

import { TemplateGallery } from '@features/notes/components/template-gallery';
import type { NoteFolder, NoteTemplate } from '@features/notes/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/ui/overlays/dialog';
import { Button } from '@shared/ui/primitives/button';
import { Input } from '@shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';
import { Text } from '@shared/ui/typography/text';

export type CreateNoteSubmitValues = {
  readonly title: string;
  readonly folderId: string | null;
  readonly templateId: string | null;
};

export type CreateNoteDialogProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly folders: readonly NoteFolder[];
  readonly templates?: readonly NoteTemplate[];
  readonly defaultFolderId?: string | null;
  readonly loading?: boolean;
  readonly onSubmit: (values: CreateNoteSubmitValues) => void | Promise<void>;
};

export const CreateNoteDialog = ({
  open,
  onOpenChange,
  folders,
  templates = [],
  defaultFolderId = null,
  loading = false,
  onSubmit,
}: CreateNoteDialogProps): ReactElement => {
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [folderId, setFolderId] = useState<string | null>(defaultFolderId);
  const [templateId, setTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setTitle('');
    setFolderId(defaultFolderId);
    setTemplateId(null);
    const frame = globalThis.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => globalThis.cancelAnimationFrame(frame);
  }, [open, defaultFolderId]);

  const handleSubmit = (event?: FormEvent): void => {
    event?.preventDefault();
    void onSubmit({
      title: title.trim() || 'Untitled',
      folderId,
      templateId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" showCloseButton={!loading} aria-labelledby={titleId}>
        <DialogHeader>
          <DialogTitle id={titleId}>Create note</DialogTitle>
          <DialogDescription>
            Enter a title and optional folder or template. Press Enter to create.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <div className="flex flex-col gap-1.5">
            <Text as="label" htmlFor={`${titleId}-input`} variant="caption" muted>
              Title
            </Text>
            <Input
              ref={inputRef}
              id={`${titleId}-input`}
              value={title}
              placeholder="Untitled"
              disabled={loading}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
              aria-label="Note title"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Text as="label" variant="caption" muted>
              Folder
            </Text>
            <Select
              value={folderId ?? '__none__'}
              onValueChange={(value) => {
                setFolderId(value === '__none__' ? null : value);
              }}
              disabled={loading}
            >
              <SelectTrigger aria-label="Folder">
                <SelectValue placeholder="No folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {templates.length > 0 ? (
            <div className="flex max-h-56 flex-col gap-2 overflow-auto">
              <Text variant="caption" muted>
                Template
              </Text>
              <TemplateGallery
                templates={templates}
                selectedTemplateId={templateId}
                onUseTemplate={(template) => {
                  setTemplateId((current) => (current === template.id ? null : template.id));
                }}
              />
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating…' : 'Create note'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
