const listeners = new Set<() => void>();

export function subscribeCustomerCacheClear(listener: () => void): () => void {
  listeners.add(listener);

  return (): void => {
    listeners.delete(listener);
  };
}

export function clearCustomerCache(): void {
  for (const listener of listeners) {
    listener();
  }
}
