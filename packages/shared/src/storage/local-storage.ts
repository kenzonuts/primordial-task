export interface LocalStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const createLocalStorageAdapter = (): LocalStorageAdapter => {
  return {
    getItem: (key: string) => window.localStorage.getItem(key),
    setItem: (key: string, value: string) => {
      window.localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
      window.localStorage.removeItem(key);
    },
  };
};
