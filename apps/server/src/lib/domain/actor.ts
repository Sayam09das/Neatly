import { isAdminRole } from "../auth/authorization.ts";
import type { AuthUserRole } from "../auth/types.ts";
import { AuthorizationError } from "../errors.ts";

export type PortalActorRole = "CUSTOMER" | "CLEANER";

export type ActorRole = AuthUserRole | PortalActorRole;

export interface Actor {
  id: string;
  role: ActorRole;
}

export function isAdminActor(actor: Actor): boolean {
  if (actor.role === "CUSTOMER" || actor.role === "CLEANER") {
    return false;
  }

  return isAdminRole(actor.role);
}

export function requireAdminActor(actor: Actor): void {
  if (!isAdminActor(actor)) {
    throw new AuthorizationError();
  }
}

export function assertOwnerOrAdmin(
  actor: Actor,
  resourceUserId: string | null,
): void {
  if (isAdminActor(actor)) {
    return;
  }

  if (resourceUserId !== null && resourceUserId === actor.id) {
    return;
  }

  throw new AuthorizationError();
}
