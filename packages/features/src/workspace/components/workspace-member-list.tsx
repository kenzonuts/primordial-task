import type { ReactElement, ReactNode } from 'react';

import { MemberCard } from '@features/workspace/components/member-card';
import type { WorkspaceMember } from '@features/workspace/types';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Text } from '@shared/ui/typography/text';

type WorkspaceMemberListProps = {
  readonly members: readonly WorkspaceMember[];
  readonly renderActions?: (member: WorkspaceMember) => ReactNode;
  readonly emptyMessage?: string;
  readonly className?: string;
};

export const WorkspaceMemberList = ({
  members,
  renderActions,
  emptyMessage = 'No members yet.',
  className,
}: WorkspaceMemberListProps): ReactElement => {
  if (members.length === 0) {
    return (
      <div
        role="status"
        className={cn(
          'rounded-lg border border-dashed border-border-subtle px-4 py-10 text-center',
          className,
        )}
      >
        <Text as="p" variant="body-sm" muted>
          {emptyMessage}
        </Text>
      </div>
    );
  }

  return (
    <Stack gap={8} role="list" aria-label="Workspace members" className={cn('w-full', className)}>
      {members.map((member) => (
        <div key={member.id} role="listitem">
          <MemberCard member={member} actions={renderActions?.(member)} />
        </div>
      ))}
    </Stack>
  );
};

export type { WorkspaceMemberListProps };
