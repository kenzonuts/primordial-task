import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContentLayout } from '@features/shell/layouts/content-layout';
import { WorkspaceSelector } from '@features/workspace/components/workspace-selector';
import { WORKSPACE_ROUTES, workspaceDetailPath } from '@features/workspace/types';
import { Button } from '@shared/ui/primitives/button';

export const WorkspaceListPage = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <ContentLayout
      title="Workspaces"
      description="Switch between workspaces or create a new one."
      actions={
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => {
            navigate(WORKSPACE_ROUTES.create);
          }}
        >
          Create workspace
        </Button>
      }
    >
      <div className="mt-24">
        <WorkspaceSelector
          onOpen={(workspace) => {
            navigate(workspaceDetailPath(workspace.id));
          }}
        />
      </div>
    </ContentLayout>
  );
};
