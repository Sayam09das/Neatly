import { randomUUID } from "node:crypto";

const FORWARDED_FOR_HEADER = "x-forwarded-for";
const REQUEST_ID_HEADER = "x-request-id";
const UNKNOWN_IP = "unknown";

export function getRequestIp(request: Request): string {
  const forwarded = request.headers.get(FORWARDED_FOR_HEADER);

  if (forwarded !== null && forwarded.trim() !== "") {
    const [first] = forwarded.split(",");
    const ip = first?.trim();

    if (ip !== undefined && ip !== "") {
      return ip;
    }
  }

  return UNKNOWN_IP;
}

export function getRequestId(request: Request): string {
  const existing = request.headers.get(REQUEST_ID_HEADER);

  if (existing !== null && existing.trim() !== "") {
    return existing.trim();
  }

  return randomUUID();
}
