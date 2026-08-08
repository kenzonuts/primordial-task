import type { ReactElement, ReactNode } from 'react';

import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@shared/ui/overlays/drawer';
import { Button } from '@shared/ui/primitives/button';
import { Text } from '@shared/ui/typography/text';

type DrillDownLink = {
  readonly id: string;
  readonly label: string;
  readonly meta?: string;
};

type DrillDownPanelProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly title: string;
  readonly description?: string;
  readonly tasks?: readonly DrillDownLink[];
  readonly projects?: readonly DrillDownLink[];
  readonly onOpenTask?: (taskId: string) => void;
  readonly onOpenProject?: (projectId: string) => void;
  readonly emptyMessage?: string;
  readonly footer?: ReactNode;
  readonly className?: string;
};

export const DrillDownPanel = ({
  open,
  onOpenChange,
  title,
  description,
  tasks = [],
  projects = [],
  onOpenTask,
  onOpenProject,
  emptyMessage = 'No linked items for this selection.',
  footer,
  className,
}: DrillDownPanelProps): ReactElement => {
  const isEmpty = tasks.length === 0 && projects.length === 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent size="default" className={cn(className)} aria-describedby={undefined}>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? <DrawerDescription>{description}</DrawerDescription> : null}
        </DrawerHeader>
        <DrawerBody>
          {isEmpty ? (
            <Text as="p" variant="body-sm" muted>
              {emptyMessage}
            </Text>
          ) : (
            <Stack gap={20}>
              {projects.length > 0 ? (
                <Stack gap={8} role="list" aria-label="Linked projects">
                  <Text as="p" variant="label" muted>
                    Projects
                  </Text>
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      role="listitem"
                      className="flex items-center justify-between gap-2"
                    >
                      <Stack gap={2} className="min-w-0">
                        <Text as="span" variant="body-sm" className="truncate">
                          {project.label}
                        </Text>
                        {project.meta ? (
                          <Text as="span" variant="caption" muted>
                            {project.meta}
                          </Text>
                        ) : null}
                      </Stack>
                      {onOpenProject ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenProject(project.id)}
                        >
                          Open
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </Stack>
              ) : null}

              {tasks.length > 0 ? (
                <Stack gap={8} role="list" aria-label="Linked tasks">
                  <Text as="p" variant="label" muted>
                    Tasks
                  </Text>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      role="listitem"
                      className="flex items-center justify-between gap-2"
                    >
                      <Stack gap={2} className="min-w-0">
                        <Text as="span" variant="body-sm" className="truncate">
                          {task.label}
                        </Text>
                        {task.meta ? (
                          <Text as="span" variant="caption" muted>
                            {task.meta}
                          </Text>
                        ) : null}
                      </Stack>
                      {onOpenTask ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => onOpenTask(task.id)}
                        >
                          Open
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </Stack>
              ) : null}
            </Stack>
          )}
          {footer}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export type { DrillDownPanelProps, DrillDownLink };
