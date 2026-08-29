import type { AuthUser } from "../auth/types.ts";
import { AuthenticationError } from "../errors.ts";
import type { RequestContext } from "../request-context.ts";
import type { Actor, SessionCustomerIdentity } from "./actor.ts";

export function actorFromUser(user: AuthUser): Actor {
  return {
    id: user.id,
    role: user.role,
  };
}

export function actorFromContext(context: RequestContext): Actor {
  if (context.user === null) {
    throw new AuthenticationError();
  }

  return actorFromUser(context.user);
}

export function cleanerActorFromContext(context: RequestContext): Actor {
  if (context.user === null) {
    throw new AuthenticationError();
  }

  return {
    id: context.user.id,
    role: "CLEANER",
  };
}

export function customerActorFromContext(context: RequestContext): Actor {
  if (context.user === null) {
    throw new AuthenticationError();
  }

  return {
    id: context.user.id,
    role: "CUSTOMER",
  };
}

export function sessionCustomerIdentityFromContext(
  context: RequestContext,
): SessionCustomerIdentity {
  if (context.user === null) {
    throw new AuthenticationError();
  }

  return sessionCustomerIdentityFromUser(context.user);
}

export function sessionCustomerIdentityFromUser(
  user: AuthUser,
): SessionCustomerIdentity {
  return {
    email: user.email,
    id: user.id,
    name: user.name,
  };
}
