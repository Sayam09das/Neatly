interface AuthLogEvent {
  type: string;
  outcome: "success" | "failure";
  requestId?: string;
  code?: string;
}

export function logAuthEvent(event: AuthLogEvent): void {
  const payload: Record<string, string> = {
    timestamp: new Date().toISOString(),
    category: "auth",
    type: event.type,
    outcome: event.outcome,
  };

  if (event.requestId !== undefined) {
    payload.requestId = event.requestId;
  }

  if (event.code !== undefined) {
    payload.code = event.code;
  }

  console.info(JSON.stringify(payload));
}
