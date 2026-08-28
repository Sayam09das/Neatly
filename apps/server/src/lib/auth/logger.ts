import { logInfo } from "../logger.ts";

interface AuthLogEvent {
  code?: string;
  outcome: "failure" | "success";
  requestId?: string;
  type: string;
}

export function logAuthEvent(event: AuthLogEvent): void {
  logInfo("Auth event", {
    category: "auth",
    code: event.code,
    outcome: event.outcome,
    requestId: event.requestId,
    type: event.type,
  });
}
