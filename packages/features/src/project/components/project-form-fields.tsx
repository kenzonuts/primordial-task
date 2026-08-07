import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { PROJECT_ICON_MAP, resolveProjectIcon } from '@features/project/components/project-avatar';
import {
  PROJECT_COLORS,
  PROJECT_ICONS,
  PROJECT_STATUS_LABELS,
  PROJECT_VISIBILITY_LABELS,
} from '@features/project/constants';
import {
  slugifyProjectName,
  type CreateProjectFormValues,
} from '@features/project/schemas/project-schemas';
import { PROJECT_STATUSES, PROJECT_VISIBILITIES } from '@features/project/types';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/forms';
import { Icon } from '@shared/ui/icons/icon';
import { Inline } from '@shared/ui/layout/inline';
import { Stack } from '@shared/ui/layout/stack';
import { cn } from '@shared/ui/lib/cn';
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

type ProjectFormFieldsProps = {
  readonly disabled?: boolean;
  readonly autoSlugFromName?: boolean;
};

export type { ProjectFormFieldsProps };

export const ProjectFormFields = ({
  disabled = false,
  autoSlugFromName = true,
}: ProjectFormFieldsProps): ReactElement => {
  const form = useFormContext<CreateProjectFormValues>();

  return (
    <Stack gap={16} className="w-full max-w-[560px]">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                size="lg"
                disabled={disabled}
                placeholder="Primordial Core"
                onChange={(event) => {
                  field.onChange(event);
                  if (!autoSlugFromName) {
                    return;
                  }
                  const currentSlug = form.getValues('slug');
                  const previousSlug = slugifyProjectName(field.value ?? '');
                  if (!currentSlug || currentSlug === previousSlug) {
                    form.setValue('slug', slugifyProjectName(event.target.value), {
                      shouldValidate: form.formState.isSubmitted,
                    });
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug</FormLabel>
            <FormControl>
              <Input {...field} size="lg" disabled={disabled} placeholder="primordial-core" />
            </FormControl>
            <FormDescription>
              Used in URLs. Lowercase letters, numbers, and hyphens.
            </FormDescription>
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
                placeholder="What is this project for?"
                rows={3}
              />
            </FormControl>
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
                {PROJECT_STATUSES.filter((status) => status !== 'archived').map((status) => (
                  <SelectItem key={status} value={status}>
                    {PROJECT_STATUS_LABELS[status]}
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
        name="visibility"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Visibility</FormLabel>
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <FormControl>
                <SelectTrigger size="lg" aria-label="Visibility">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PROJECT_VISIBILITIES.map((visibility) => (
                  <SelectItem key={visibility} value={visibility}>
                    {PROJECT_VISIBILITY_LABELS[visibility]}
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
        name="color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Color</FormLabel>
            <FormControl>
              <Inline
                gap={8}
                align="center"
                className="flex-wrap"
                role="radiogroup"
                aria-label="Project color"
              >
                {PROJECT_COLORS.map((color) => {
                  const selected = field.value === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={disabled}
                      aria-label={color}
                      className={cn(
                        'size-8 rounded-full border border-border-default ds-transition-fast',
                        'focus-visible:outline-none focus-visible:ds-focus-ring',
                        selected &&
                          'ring-2 ring-[var(--state-focus)] ring-offset-2 ring-offset-bg-app',
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        field.onChange(color);
                      }}
                    />
                  );
                })}
              </Inline>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="icon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Icon</FormLabel>
            <FormControl>
              <Inline
                gap={8}
                align="center"
                className="flex-wrap"
                role="radiogroup"
                aria-label="Project icon"
              >
                {PROJECT_ICONS.map((iconName) => {
                  const selected = (field.value ?? '') === iconName;
                  const IconComponent =
                    resolveProjectIcon(iconName) ?? PROJECT_ICON_MAP.FolderKanban;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      disabled={disabled}
                      aria-label={iconName}
                      className={cn(
                        'inline-flex size-9 items-center justify-center rounded-md border border-border-default bg-surface-elevated text-text-secondary ds-transition-fast',
                        'focus-visible:outline-none focus-visible:ds-focus-ring',
                        selected &&
                          'border-border-strong bg-state-selected text-text-primary ring-2 ring-[var(--state-focus)] ring-offset-2 ring-offset-bg-app',
                      )}
                      onClick={() => {
                        field.onChange(iconName);
                      }}
                    >
                      <Icon icon={IconComponent} decorative />
                    </button>
                  );
                })}
              </Inline>
            </FormControl>
            <FormDescription>Optional. Shown on the project avatar.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <Text as="p" variant="caption" muted>
        You can change these settings later.
      </Text>
    </Stack>
  );
};
