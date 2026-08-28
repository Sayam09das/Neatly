import type { IncomingMessage, ServerResponse } from "node:http";
import { createRequestListener } from "../../../apps/server/src/app.ts";

export interface MockResponse {
  body: string;
  headers: Record<string, string>;
  statusCode: number;
}

export interface DispatchInput {
  body?: string;
  headers?: Record<string, string>;
  method?: string;
  url?: string;
}

export function dispatchApi(input: DispatchInput = {}): Promise<MockResponse> {
  const listener = createRequestListener();
  const req = createMockRequest(input);
  const mock = createMockResponse();

  return new Promise((resolve) => {
    const originalEnd = mock.res.end.bind(mock.res);

    mock.res.end = ((data?: string): ServerResponse => {
      originalEnd(data);
      resolve({
        body: mock.body,
        headers: mock.headers,
        statusCode: mock.statusCode,
      });
      return mock.res;
    }) as ServerResponse["end"];

    listener(req, mock.res);
  });
}

export function parseJsonBody(body: string): unknown {
  return JSON.parse(body) as unknown;
}

function createMockRequest(input: DispatchInput): IncomingMessage {
  const payload = input.body ?? "";
  const buffer = Buffer.from(payload);
  let consumed = false;

  return {
    headers: input.headers ?? {},
    method: input.method ?? "GET",
    socket: { remoteAddress: "127.0.0.1" },
    url: input.url ?? "/",
    async *[Symbol.asyncIterator]() {
      if (!consumed && buffer.length > 0) {
        consumed = true;
        yield buffer;
      }
    },
  } as IncomingMessage;
}

function createMockResponse(): {
  body: string;
  headers: Record<string, string>;
  res: ServerResponse;
  statusCode: number;
} {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body = "";
  let headersSent = false;

  const res = {
    end(data?: string): void {
      headersSent = true;
      if (data !== undefined) {
        body = data;
      }
    },
    get headersSent(): boolean {
      return headersSent;
    },
    getHeader(name: string): string | undefined {
      return headers[name.toLowerCase()];
    },
    setHeader(name: string, value: string): void {
      headers[name.toLowerCase()] = value;
    },
    get statusCode(): number {
      return statusCode;
    },
    set statusCode(code: number) {
      statusCode = code;
    },
  } as unknown as ServerResponse;

  return {
    get body(): string {
      return body;
    },
    get headers(): Record<string, string> {
      return headers;
    },
    res,
    get statusCode(): number {
      return statusCode;
    },
  };
}
