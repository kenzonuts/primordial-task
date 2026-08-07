import { MessageSquare, Reply } from 'lucide-react';
import type { FormEvent, ReactElement } from 'react';
import { useMemo, useState } from 'react';

import type { TaskComment as TaskCommentModel } from '@features/task/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/ui/primitives/avatar';
import { Button } from '@shared/ui/primitives/button';
import { Textarea } from '@shared/ui/primitives/textarea';
import { Text } from '@shared/ui/typography/text';

type TaskCommentProps = {
  readonly comments: readonly TaskCommentModel[];
  readonly onSubmit?: (body: string, parentId?: string | null) => void;
  readonly disabled?: boolean;
  readonly className?: string;
};

const personInitials = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
};

const formatCommentTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

type CommentNode = {
  readonly comment: TaskCommentModel;
  readonly replies: readonly TaskCommentModel[];
};

export const TaskCommentList = ({
  comments,
  onSubmit,
  disabled = false,
  className,
}: TaskCommentProps): ReactElement => {
  const [body, setBody] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const nodes = useMemo((): readonly CommentNode[] => {
    const roots = comments.filter((comment) => comment.parentId == null);
    return roots.map((comment) => ({
      comment,
      replies: comments.filter((reply) => reply.parentId === comment.id),
    }));
  }, [comments]);

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed || !onSubmit) {
      return;
    }
    onSubmit(trimmed, replyToId);
    setBody('');
    setReplyToId(null);
  };

  return (
    <Stack gap={16} className={cn('w-full', className)}>
      <Inline gap={8} align="center">
        <MessageSquare className="size-4 text-text-muted" aria-hidden="true" />
        <Text as="span" variant="body-sm" className="font-medium">
          Comments
        </Text>
        <Text as="span" variant="caption" muted>
          {comments.length}
        </Text>
      </Inline>

      {nodes.length === 0 ? (
        <Text as="p" variant="caption" muted>
          No comments yet. Start the thread below.
        </Text>
      ) : (
        <ul aria-label="Comments" className="flex flex-col gap-16">
          {nodes.map(({ comment, replies }) => (
            <li key={comment.id}>
              <CommentItem
                comment={comment}
                disabled={disabled || !onSubmit}
                onReply={() => setReplyToId(comment.id)}
              />
              {replies.length > 0 ? (
                <ul
                  aria-label={`Replies to ${comment.author.fullName}`}
                  className="mt-12 ml-10 flex flex-col gap-12 border-l border-border-subtle pl-12"
                >
                  {replies.map((reply) => (
                    <li key={reply.id}>
                      <CommentItem comment={reply} disabled />
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {onSubmit ? (
        <form onSubmit={handleSubmit}>
          <Stack gap={8}>
            {replyToId ? (
              <Inline gap={8} align="center" justify="between">
                <Text as="span" variant="caption" muted>
                  Replying to thread
                </Text>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => setReplyToId(null)}
                >
                  Cancel reply
                </Button>
              </Inline>
            ) : null}
            <Textarea
              value={body}
              disabled={disabled}
              rows={3}
              placeholder="Write a comment… Use @ to mention someone (coming soon)"
              aria-label="Comment body"
              onChange={(event) => setBody(event.target.value)}
            />
            <Inline gap={8} align="center" justify="end">
              <Button
                type="submit"
                size="sm"
                variant="secondary"
                disabled={disabled || body.trim().length === 0}
              >
                {replyToId ? 'Reply' : 'Comment'}
              </Button>
            </Inline>
          </Stack>
        </form>
      ) : null}
    </Stack>
  );
};

const CommentItem = ({
  comment,
  onReply,
  disabled = false,
}: {
  readonly comment: TaskCommentModel;
  readonly onReply?: () => void;
  readonly disabled?: boolean;
}): ReactElement => {
  return (
    <Inline gap={8} align="start" className="w-full">
      <Avatar size="sm">
        {comment.author.avatarUrl ? <AvatarImage src={comment.author.avatarUrl} alt="" /> : null}
        <AvatarFallback initials={personInitials(comment.author.fullName)} />
      </Avatar>
      <Stack gap={4} className="min-w-0 flex-1">
        <Inline gap={8} align="center" className="flex-wrap">
          <Text as="span" variant="body-sm" className="font-medium">
            {comment.author.fullName}
          </Text>
          <Text as="span" variant="caption" muted>
            {formatCommentTime(comment.createdAt)}
          </Text>
        </Inline>
        <Text as="p" variant="body-sm" className="whitespace-pre-wrap">
          {comment.body}
        </Text>
        {onReply ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled}
            className="w-fit"
            onClick={onReply}
          >
            <Reply aria-hidden="true" className="size-3.5" />
            Reply
          </Button>
        ) : null}
      </Stack>
    </Inline>
  );
};

/** Primary export name matching the file contract. */
export const TaskComment = TaskCommentList;

export type { TaskCommentProps };
