export type ToastVariant = "error" | "info" | "success" | "warning";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastInput {
  action?: ToastAction;
  description?: string;
  durationMs?: number;
  title: string;
}

export interface ToastRecord extends ToastInput {
  id: string;
  variant: ToastVariant;
}

export const TOAST_MAX_VISIBLE = 4;

export const TOAST_DURATION_MS: Record<ToastVariant, number> = {
  error: 9000,
  info: 4000,
  success: 4000,
  warning: 6000,
};

const listeners = new Set<(toasts: readonly ToastRecord[]) => void>();
let toasts: ToastRecord[] = [];
let toastSequence = 0;

function emit(): void {
  for (const listener of listeners) {
    listener(toasts);
  }
}

function addToast(variant: ToastVariant, input: ToastInput): string {
  toastSequence += 1;
  const id = `toast_${String(toastSequence)}`;
  const next: ToastRecord = {
    ...input,
    id,
    variant,
  };

  toasts = [next, ...toasts].slice(0, TOAST_MAX_VISIBLE);
  emit();
  return id;
}

export function subscribeToToasts(
  listener: (toasts: readonly ToastRecord[]) => void,
): () => void {
  listeners.add(listener);
  listener(toasts);

  return (): void => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((toastRecord) => toastRecord.id !== id);
  emit();
}

export function clearToasts(): void {
  toasts = [];
  emit();
}

export const toast = {
  clear: clearToasts,
  dismiss: dismissToast,
  error: (input: ToastInput): string => addToast("error", input),
  info: (input: ToastInput): string => addToast("info", input),
  success: (input: ToastInput): string => addToast("success", input),
  warning: (input: ToastInput): string => addToast("warning", input),
} as const;
