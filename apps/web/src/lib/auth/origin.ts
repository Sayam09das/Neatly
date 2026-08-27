export function isSameOriginRequest(
  request: Request,
  siteUrl: string,
): boolean {
  const allowedOrigin = new URL(siteUrl).origin;
  const originHeader = request.headers.get("origin");

  if (originHeader !== null && originHeader.trim() !== "") {
    return originHeader === allowedOrigin;
  }

  const refererHeader = request.headers.get("referer");

  if (refererHeader !== null && refererHeader.trim() !== "") {
    return new URL(refererHeader).origin === allowedOrigin;
  }

  const hostHeader = request.headers.get("host");

  if (hostHeader === null || hostHeader.trim() === "") {
    return false;
  }

  return hostHeader === new URL(siteUrl).host;
}
