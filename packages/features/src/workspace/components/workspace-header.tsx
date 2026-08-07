import type { ReactElement, ReactNode } from 'react';

import { RoleBadge } from '@features/workspace/components/role-badge';
import { WorkspaceLogo } from '@features/workspace/components/workspace-logo';
import type { Workspace, WorkspaceRole } from '@features/workspace/types';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import { Heading } from '@shared/ui/typography/heading';
import { Text } from '@shared/ui/typography/text';

type WorkspaceHeaderProps = {
  readonly workspace?: Pick<Workspace, 'name' | 'description' | 'color' | 'logoUrl' | 'role'>;
  readonly name?: string;
  readonly description?: string;
  readonly color?: string;
  readonly logoUrl?: string;
  readonly role?: WorkspaceRole;
  readonly actions?: ReactNode;
  readonly className?: string;
};

export const WorkspaceHeader = ({
  workspace,
  name,
  description,
  color,
  logoUrl,
  role,
  actions,
  className,
}: WorkspaceHeaderProps): ReactElement => {
  const resolvedName = workspace?.name ?? name ?? 'Workspace';
  const resolvedDescription = workspace?.description ?? description;
  const resolvedColor = workspace?.color ?? color ?? '#E6E6E6';
  const resolvedLogoUrl = workspace?.logoUrl ?? logoUrl;
  const resolvedRole = workspace?.role ?? role;

  return (
    <Inline gap={16} align="start" justify="between" className={cn('w-full', className)}>
      <Inline gap={16} align="start" className="min-w-0 flex-1">
        <WorkspaceLogo
          name={resolvedName}
          color={resolvedColor}
          logoUrl={resolvedLogoUrl}
          size="lg"
        />
        <Stack gap={8} className="min-w-0 flex-1">
          <Inline gap={8} align="center" className="min-w-0 flex-wrap">
            <Heading level={1} className="truncate">
              {resolvedName}
            </Heading>
            {resolvedRole ? <RoleBadge role={resolvedRole} size="md" /> : null}
          </Inline>
          {resolvedDescription ? (
            <Text as="p" variant="body-md" muted className="max-w-[720px]">
              {resolvedDescription}
            </Text>
          ) : null}
        </Stack>
      </Inline>
      {actions ? (
        <Inline gap={8} align="center" className="shrink-0">
          {actions}
        </Inline>
      ) : null}
    </Inline>
  );
};

export type { WorkspaceHeaderProps };
