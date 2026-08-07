import type { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { WORKSPACE_COLORS } from '@features/workspace/rbac';
import {
  slugifyWorkspaceName,
  type CreateWorkspaceFormValues,
} from '@features/workspace/schemas/workspace-schemas';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/forms';
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

type WorkspaceFormFieldsProps = {
  readonly disabled?: boolean;
  readonly autoSlugFromName?: boolean;
};

export type { WorkspaceFormFieldsProps };

export const WorkspaceFormFields = ({
  disabled = false,
  autoSlugFromName = true,
}: WorkspaceFormFieldsProps): ReactElement => {
  const form = useFormContext<CreateWorkspaceFormValues>();

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
                placeholder="Primordial Studio"
                onChange={(event) => {
                  field.onChange(event);
                  if (!autoSlugFromName) {
                    return;
                  }
                  const currentSlug = form.getValues('slug');
                  const previousSlug = slugifyWorkspaceName(field.value ?? '');
                  if (!currentSlug || currentSlug === previousSlug) {
                    form.setValue('slug', slugifyWorkspaceName(event.target.value), {
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
              <Input {...field} size="lg" disabled={disabled} placeholder="primordial-studio" />
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
                placeholder="What is this workspace for?"
                rows={3}
              />
            </FormControl>
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
                aria-label="Workspace color"
              >
                {WORKSPACE_COLORS.map((color) => {
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
        name="logoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ''}
                size="lg"
                disabled={disabled}
                placeholder="https://…"
              />
            </FormControl>
            <FormDescription>Optional. Leave blank to use initials.</FormDescription>
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
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
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
