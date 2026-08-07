import { Download, Eye, FileIcon, Link2, Trash2, Upload } from 'lucide-react';
import type { ChangeEvent, ReactElement } from 'react';
import { useRef } from 'react';

import type { TaskAttachment as TaskAttachmentModel } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@shared/ui/overlays/tooltip';
import { Button } from '@shared/ui/primitives/button';
import { IconButton } from '@shared/ui/primitives/icon-button';
import { Text } from '@shared/ui/typography/text';

type TaskAttachmentProps = {
  readonly attachments: readonly TaskAttachmentModel[];
  readonly onUpload?: (files: FileList) => void;
  readonly onPreview?: (attachmentId: string) => void;
  readonly onDownload?: (attachmentId: string) => void;
  readonly onDelete?: (attachmentId: string) => void;
  readonly disabled?: boolean;
  readonly className?: string;
};

const kindIcon = (kind: TaskAttachmentModel['kind']) => {
  if (kind === 'link') {
    return Link2;
  }
  return FileIcon;
};

const formatCreated = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export const TaskAttachmentList = ({
  attachments,
  onUpload,
  onPreview,
  onDownload,
  onDelete,
  disabled = false,
  className,
}: TaskAttachmentProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    if (files && files.length > 0 && onUpload) {
      onUpload(files);
    }
    event.target.value = '';
  };

  return (
    <Stack gap={12} className={cn('w-full', className)}>
      <Inline gap={8} align="center" justify="between" className="w-full">
        <Text as="span" variant="body-sm" className="font-medium">
          Attachments
        </Text>
        {onUpload ? (
          <>
            <input
              ref={inputRef}
              type="file"
              multiple
              className="sr-only"
              disabled={disabled}
              aria-label="Upload attachments"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              <Upload aria-hidden="true" className="size-3.5" />
              Upload
            </Button>
          </>
        ) : null}
      </Inline>

      {attachments.length === 0 ? (
        <Text as="p" variant="caption" muted>
          No attachments yet.
        </Text>
      ) : (
        <ul aria-label="Attachments" className="flex flex-col gap-8">
          {attachments.map((attachment) => {
            const Icon = kindIcon(attachment.kind);
            return (
              <li
                key={attachment.id}
                className="flex items-center gap-8 rounded-md border border-border-subtle bg-surface-elevated px-3 py-2"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-8 items-center justify-center rounded-md bg-state-selected text-text-secondary"
                >
                  <Icon className="size-4" />
                </span>
                <Stack gap={2} className="min-w-0 flex-1">
                  <Text as="span" variant="body-sm" truncate className="font-medium">
                    {attachment.name}
                  </Text>
                  <Text as="span" variant="caption" muted>
                    {attachment.sizeLabel} · {formatCreated(attachment.createdAt)}
                  </Text>
                </Stack>

                <TooltipProvider delayDuration={300}>
                  <Inline gap={2} align="center" className="shrink-0">
                    {onPreview && attachment.previewPlaceholder ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={disabled}
                            aria-label={`Preview ${attachment.name}`}
                            onClick={() => onPreview(attachment.id)}
                          >
                            <Eye aria-hidden="true" />
                          </IconButton>
                        </TooltipTrigger>
                        <TooltipContent side="top">Preview</TooltipContent>
                      </Tooltip>
                    ) : null}
                    {onDownload ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={disabled}
                            aria-label={`Download ${attachment.name}`}
                            onClick={() => onDownload(attachment.id)}
                          >
                            <Download aria-hidden="true" />
                          </IconButton>
                        </TooltipTrigger>
                        <TooltipContent side="top">Download</TooltipContent>
                      </Tooltip>
                    ) : null}
                    {onDelete ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <IconButton
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={disabled}
                            aria-label={`Delete ${attachment.name}`}
                            onClick={() => onDelete(attachment.id)}
                          >
                            <Trash2 aria-hidden="true" />
                          </IconButton>
                        </TooltipTrigger>
                        <TooltipContent side="top">Delete</TooltipContent>
                      </Tooltip>
                    ) : null}
                  </Inline>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      )}
    </Stack>
  );
};

export const TaskAttachment = TaskAttachmentList;

export type { TaskAttachmentProps };
