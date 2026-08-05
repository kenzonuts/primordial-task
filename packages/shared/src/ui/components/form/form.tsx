import type { ReactNode } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { FormProvider, useFormContext } from 'react-hook-form';
import type { ZodTypeAny } from 'zod';

import { cn } from '@ui/lib/cn';

interface AppFormProps<TFieldValues extends FieldValues> {
  readonly form: UseFormReturn<TFieldValues>;
  readonly onSubmit: (values: TFieldValues) => void;
  readonly children: ReactNode;
  readonly className?: string;
}

export const AppForm = <TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: AppFormProps<TFieldValues>): ReactNode => {
  return (
    <FormProvider {...form}>
      <form
        className={cn('flex flex-col gap-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
};

interface FormFieldProps<TFieldValues extends FieldValues> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly description?: string;
  readonly children: ReactNode;
}

export const FormField = <TFieldValues extends FieldValues>({
  name,
  label,
  description,
  children,
}: FormFieldProps<TFieldValues>): ReactNode => {
  const {
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-[560] text-text-primary">{label}</span>
      {children}
      {description ? <span className="text-xs text-text-muted">{description}</span> : null}
      {errorMessage ? <span className="text-xs text-danger">{errorMessage}</span> : null}
    </label>
  );
};

interface SchemaMessageMap {
  [key: string]: string;
}

export const createSchemaMessageMap = (schema: ZodTypeAny): SchemaMessageMap => {
  const shape = (schema as { shape?: Record<string, unknown> }).shape;

  if (!shape) {
    return {};
  }

  return Object.keys(shape).reduce<SchemaMessageMap>((accumulator, key) => {
    return {
      ...accumulator,
      [key]: `${key} is invalid`,
    };
  }, {});
};
