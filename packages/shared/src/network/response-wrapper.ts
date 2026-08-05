export interface ResponseEnvelope<TData> {
  data: TData | null;
  error: string | null;
  success: boolean;
}

export const createResponseEnvelope = <TData>(
  data: TData | null,
  error: string | null = null,
): ResponseEnvelope<TData> => ({
  data,
  error,
  success: error === null,
});
