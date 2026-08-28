import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../config/constants.ts";
import { type ApiNodeEnv, isProductionEnv } from "../config/env.ts";
import { type AppError, toAppError } from "./errors.ts";

export interface ApiSuccessBody<T> {
  data: T;
  error: null;
  success: true;
  timestamp: string;
}

export interface ApiErrorBody {
  data: null;
  error: {
    code: string;
    details?: readonly { field: string; issue: string }[];
    message: string;
  };
  success: false;
  timestamp: string;
}

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  body: ApiErrorBody | ApiSuccessBody<unknown>,
): void {
  if (res.headersSent) {
    return;
  }

  res.statusCode = statusCode;
  res.setHeader("cache-control", "no-store");
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(`${JSON.stringify(body)}\n`);
}

export function sendSuccess<T>(
  res: ServerResponse,
  data: T,
  statusCode: number = HTTP_STATUS.OK,
): void {
  const body: ApiSuccessBody<T> = {
    data,
    error: null,
    success: true,
    timestamp: new Date().toISOString(),
  };

  sendJson(res, statusCode, body);
}

export function sendFailure(
  res: ServerResponse,
  error: AppError,
  nodeEnv: ApiNodeEnv,
): void {
  const exposeDetails = error.expose || !isProductionEnv(nodeEnv);
  const message = exposeDetails
    ? error.message
    : "An unexpected error occurred.";

  const body: ApiErrorBody = {
    data: null,
    error: {
      code: error.code,
      message,
      ...(error.details === undefined ? {} : { details: error.details }),
    },
    success: false,
    timestamp: new Date().toISOString(),
  };

  sendJson(res, error.statusCode, body);
}

export function sendUnknownError(
  res: ServerResponse,
  error: unknown,
  nodeEnv: ApiNodeEnv,
): void {
  sendFailure(res, toAppError(error), nodeEnv);
}

export function getRequestPath(req: IncomingMessage): string {
  const host = req.headers.host ?? "localhost";
  const url = new URL(req.url ?? "/", `http://${host}`);
  return url.pathname;
}

export function getRequestMethod(req: IncomingMessage): string {
  return (req.method ?? "GET").toUpperCase();
}
