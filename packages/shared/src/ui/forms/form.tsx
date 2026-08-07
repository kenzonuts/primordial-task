import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  createContext,
  useContext,
  useId,
} from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { cn } from '@shared/ui/lib/cn';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  readonly name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

type FormItemContextValue = {
  readonly id: string;
};

const FormItemContext = createContext<FormItemContextValue | null>(null);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>): ReactElement => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type UseFormFieldResult = {
  readonly id: string;
  readonly name: string;
  readonly formItemId: string;
  readonly formDescriptionId: string;
  readonly formMessageId: string;
  readonly error?: { message?: string };
};

const useFormField = (): UseFormFieldResult => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField must be used within <FormField>');
  }

  if (!itemContext) {
    throw new Error('useFormField must be used within <FormItem>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    error: fieldState.error,
  };
};

const FormItem = ({ className, ...props }: HTMLAttributes<HTMLDivElement>): ReactElement => {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
};

type FormLabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

const FormLabel = ({ className, ...props }: FormLabelProps): ReactElement => {
  const { error, formItemId } = useFormField();

  return (
    <LabelPrimitive.Root
      className={cn(
        'text-xs font-medium leading-4 text-text-secondary',
        error && 'text-danger',
        className,
      )}
      htmlFor={formItemId}
      {...props}
    />
  );
};

type FormControlProps = ComponentPropsWithoutRef<typeof Slot>;

const FormControl = ({ ...props }: FormControlProps): ReactElement => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId}
      aria-invalid={Boolean(error) || undefined}
      {...props}
    />
  );
};

const FormDescription = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>): ReactElement => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn('text-[12px] leading-[18px] text-text-muted', className)}
      {...props}
    />
  );
};

type FormMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  readonly children?: ReactNode;
};

const FormMessage = ({ className, children, ...props }: FormMessageProps): ReactElement | null => {
  const { error, formMessageId } = useFormField();
  const body = error?.message ? String(error.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      role="alert"
      className={cn('text-[12px] leading-[18px] font-medium text-danger', className)}
      {...props}
    >
      {body}
    </p>
  );
};

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};

export type { FormLabelProps, FormControlProps, FormMessageProps, UseFormFieldResult };
