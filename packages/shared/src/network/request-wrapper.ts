export interface RequestWrapperOptions {
  timeoutMs?: number;
  retries?: number;
}

export const createRequestWrapper = (
  options: RequestWrapperOptions = {},
): (<TResponse>(request: () => Promise<TResponse>) => Promise<TResponse>) => {
  return async <TResponse>(request: () => Promise<TResponse>): Promise<TResponse> => {
    const timeoutMs = options.timeoutMs ?? 10_000;
    const retries = options.retries ?? 0;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        return await Promise.race([
          request(),
          new Promise<TResponse>((_, reject) => {
            globalThis.setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
          }),
        ]);
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
      }
    }

    throw new Error('Request failed');
  };
};
