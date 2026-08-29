import type { IncomingMessage, ServerResponse } from "node:http";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import type { RequestContext } from "../../lib/request-context.ts";

export function adminMeController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): void {
  actorFromContext(context);
  sendSuccess(res, { user: context.user });
}

export async function adminDashboardController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const actor = actorFromContext(context);
  const services = getDomainServices();
  const [metrics, recentCustomers] = await Promise.all([
    services.dashboard.getMetrics(actor),
    services.customers.list(actor, {
      pagination: { limit: 8, page: 1, skip: 0 },
    }),
  ]);

  sendSuccess(res, {
    ...metrics,
    recentCustomers: recentCustomers.items,
  });
}
