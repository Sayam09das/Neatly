export type LogFields = Record<string, string | number | boolean | undefined>;

export function logInfo(message: string, fields: LogFields = {}): void {
  writeLog("info", message, fields, process.stdout);
}

export function logError(message: string, fields: LogFields = {}): void {
  writeLog("error", message, fields, process.stderr);
}

function writeLog(
  level: "error" | "info",
  message: string,
  fields: LogFields,
  stream: NodeJS.WriteStream,
): void {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...sanitize(fields),
  };

  stream.write(`${JSON.stringify(entry)}\n`);
}

function sanitize(fields: LogFields): LogFields {
  const next: LogFields = {};

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) {
      continue;
    }

    next[key] = value;
  }

  return next;
}
