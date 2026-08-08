import type { ReactElement } from 'react';

import { CommentComposer } from '@features/notes/components/comment-composer';
import type { NoteComment } from '@features/notes/types';
import { ScrollArea } from '@shared/ui/layout/scroll-area';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type CommentThreadProps = {
  readonly comments: readonly NoteComment[];
  readonly status?: 'idle' | 'loading' | 'ready' | 'error';
  readonly onAdd?: (body: string, parentId?: string | null) => void | Promise<void>;
  readonly onResolve?: (commentId: string, resolved: boolean) => void | Promise<void>;
  readonly onDelete?: (commentId: string) => void | Promise<void>;
  readonly className?: string;
};

export const CommentThread = ({
  comments,
  status = 'ready',
  onAdd,
  onResolve,
  onDelete,
  className,
}: CommentThreadProps): ReactElement => {
  const roots = comments.filter((comment) => comment.parentId == null);
  const repliesByParent = new Map<string, NoteComment[]>();
  for (const comment of comments) {
    if (comment.parentId) {
      const bucket = repliesByParent.get(comment.parentId) ?? [];
      bucket.push(comment);
      repliesByParent.set(comment.parentId, bucket);
    }
  }

  return (
    <aside
      aria-label="Comments"
      className={cn(
        'flex h-full min-h-0 w-[300px] flex-col border-l border-border-default bg-surface-sidebar',
        className,
      )}
    >
      <div className="border-b border-border-subtle px-3 py-2.5">
        <Text variant="caption" muted className="uppercase tracking-wide font-medium">
          Comments
        </Text>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <Stack gap={12} className="p-3">
          {status === 'loading' ? (
            <Text variant="caption" muted>
              Loading comments…
            </Text>
          ) : null}
          {status === 'ready' && roots.length === 0 ? (
            <Text variant="caption" muted>
              No comments yet
            </Text>
          ) : null}
          {roots.map((comment) => {
            const replies = repliesByParent.get(comment.id) ?? [];
            return (
              <div
                key={comment.id}
                className={cn(
                  'rounded-md border border-border-subtle p-2',
                  comment.resolved && 'opacity-60',
                )}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Text as="span" variant="caption" className="font-medium">
                    {comment.author.fullName}
                  </Text>
                  <Text as="span" variant="caption" muted>
                    {new Date(comment.createdAt).toLocaleString()}
                  </Text>
                </div>
                <Text as="p" variant="body-sm" className="whitespace-pre-wrap">
                  {comment.body}
                </Text>
                <div className="mt-2 flex flex-wrap gap-1">
                  {onResolve ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => void onResolve(comment.id, !comment.resolved)}
                    >
                      {comment.resolved ? 'Reopen' : 'Resolve'}
                    </Button>
                  ) : null}
                  {onDelete ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="text-danger"
                      onClick={() => void onDelete(comment.id)}
                    >
                      Delete
                    </Button>
                  ) : null}
                </div>
                {replies.length > 0 ? (
                  <Stack gap={8} className="mt-2 border-l border-border-subtle pl-2">
                    {replies.map((reply) => (
                      <div key={reply.id}>
                        <Text as="span" variant="caption" className="font-medium">
                          {reply.author.fullName}
                        </Text>
                        <Text as="p" variant="body-sm" className="whitespace-pre-wrap">
                          {reply.body}
                        </Text>
                      </div>
                    ))}
                  </Stack>
                ) : null}
              </div>
            );
          })}
        </Stack>
      </ScrollArea>
      {onAdd ? (
        <div className="border-t border-border-subtle p-3">
          <CommentComposer onSubmit={(body) => onAdd(body, null)} />
        </div>
      ) : null}
    </aside>
  );
};

export type { CommentThreadProps };
