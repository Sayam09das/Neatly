import type { IncomingMessage, ServerResponse } from "node:http";

export function applySecurityHeaders(
  _req: IncomingMessage,
  res: ServerResponse,
): void {
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("x-frame-options", "DENY");
  res.setHeader("referrer-policy", "no-referrer");
  res.setHeader("x-dns-prefetch-control", "off");
}
