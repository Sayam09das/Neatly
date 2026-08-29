import type { AuthUser } from "../auth/types.ts";
import { AuthenticationError } from "../errors.ts";
import type { RequestContext } from "../request-context.ts";
import type { Actor } from "./actor.ts";

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
