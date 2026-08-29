export function customerQueryKey(
  userId: string,
  scope: string,
  ...parts: readonly string[]
): readonly string[] {
  const identity = userId.trim();
  const name = scope.trim();

  if (identity === "" || name === "") {
    throw new Error("Customer query keys require a session user id and scope.");
  }

  return ["customer", identity, name, ...parts];
}

export const customerQueryKeys = {
  bookings: (userId: string): readonly string[] =>
    customerQueryKey(userId, "bookings"),
  notifications: (userId: string): readonly string[] =>
    customerQueryKey(userId, "notifications"),
  profile: (userId: string): readonly string[] =>
    customerQueryKey(userId, "profile"),
  reviews: (userId: string): readonly string[] =>
    customerQueryKey(userId, "reviews"),
  root: (userId: string): readonly string[] => customerQueryKey(userId, "root"),
  services: (userId: string): readonly string[] =>
    customerQueryKey(userId, "services"),
} as const;
