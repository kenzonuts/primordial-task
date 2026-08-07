import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_TYPE_LABELS,
} from '@features/task/constants';
import type { CreateTaskFormValues } from '@features/task/schemas/task-schemas';
import { TASK_PRIORITIES, TASK_STATUSES, TASK_TYPES } from '@features/task/types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/forms';
import { Stack } from '@shared/ui/layout/stack';
import { Input } from '@shared/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/primitives/select';
import { Textarea } from '@shared/ui/primitives/textarea';
import { Text } from '@shared/ui/typography/text';

type ProjectOption = {
  readonly id: string;
  readonly name: string;
};

type AssigneeOption = {
  readonly id: string;
  readonly fullName: string;
};

type TaskFormFieldsProps = {
  readonly disabled?: boolean;
  readonly projectOptions?: readonly ProjectOption[];
  readonly assigneeOptions?: readonly AssigneeOption[];
};

const toDateInputValue = (value: number | null | undefined): string => {
  if (value == null) {
    return '';
  }
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fromDateInputValue = (value: string): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(`${value}T00:00:00`);
  return Number.isNaN(parsed) ? null : parsed;
};

export const TaskFormFields = ({
  disabled = false,
  projectOptions = [],
  assigneeOptions = [],
}: TaskFormFieldsProps): ReactElement => {
  const form = useFormContext<CreateTaskFormValues>();

  return (
    <Stack gap={16} className="w-full max-w-[560px]">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                size="lg"
                disabled={disabled}
                placeholder="Ship dark monochrome task board"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                value={field.value ?? ''}
                disabled={disabled}
                placeholder="Optional details, acceptance criteria, or notes"
                rows={4}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="projectId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project</FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <FormControl>
                <SelectTrigger size="lg" aria-label="Project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projectOptions.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <FormControl>
                <SelectTrigger size="lg" aria-label="Status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TASK_STATUSES.filter((status) => status !== 'archived').map((status) => (
                  <SelectItem key={status} value={status}>
                    {TASK_STATUS_LABELS[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Priority</FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <FormControl>
                <SelectTrigger size="lg" aria-label="Priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TASK_PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {TASK_PRIORITY_LABELS[priority]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <FormControl>
                <SelectTrigger size="lg" aria-label="Type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {TASK_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {TASK_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="assigneeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Assignee</FormLabel>
            <Select
              value={field.value ?? 'unassigned'}
              onValueChange={(value) => {
                field.onChange(value === 'unassigned' ? null : value);
              }}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger size="lg" aria-label="Assignee">
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {assigneeOptions.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start date</FormLabel>
            <FormControl>
              <Input
                type="date"
                size="lg"
                disabled={disabled}
                value={toDateInputValue(field.value)}
                onChange={(event) => {
                  field.onChange(fromDateInputValue(event.target.value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Due date</FormLabel>
            <FormControl>
              <Input
                type="date"
                size="lg"
                disabled={disabled}
                value={toDateInputValue(field.value)}
                onChange={(event) => {
                  field.onChange(fromDateInputValue(event.target.value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="estimatedMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estimate (minutes)</FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                size="lg"
                disabled={disabled}
                value={field.value ?? ''}
                placeholder="60"
                onChange={(event) => {
                  const next = event.target.value;
                  field.onChange(next === '' ? null : Number(next));
                }}
              />
            </FormControl>
            <FormDescription>Optional time estimate in minutes.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Text as="p" variant="caption" muted>
        You can adjust properties and checklist items after creating the task.
      </Text>
    </Stack>
  );
};

export type { TaskFormFieldsProps, ProjectOption, AssigneeOption };
