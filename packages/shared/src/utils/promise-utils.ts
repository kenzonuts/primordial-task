export const waitFor = async <TValue>(value: TValue, delayMs = 0): Promise<TValue> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, delayMs);
  });

  return value;
};

export const safeAsync = async <TValue>(
  executor: () => Promise<TValue>,
): Promise<TValue | null> => {
  try {
    return await executor();
  } catch {
    return null;
  }
};
