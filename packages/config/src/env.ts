export type EnvSource = Record<string, string | undefined>;

export class EnvValidationError extends Error {
  public readonly variableNames: readonly string[];

  public constructor(
    messages: readonly string[],
    variableNames: readonly string[],
  ) {
    super(`Invalid environment configuration.\n${messages.join("\n")}`);
    this.name = "EnvValidationError";
    this.variableNames = variableNames;
  }
}

export function describeEnvVariable(
  name: string,
  options: {
    required: boolean;
    visibility: "server-only" | "client-safe";
    expected: string;
  },
): string {
  const requirement = options.required ? "required" : "optional";
  return `${name} (${requirement}, ${options.visibility}; expected ${options.expected})`;
}

export function missingVariableMessage(
  name: string,
  options: {
    required: boolean;
    visibility: "server-only" | "client-safe";
    expected: string;
  },
): string {
  return `${name} is required. ${describeEnvVariable(name, options)}`;
}

export function invalidVariableMessage(
  name: string,
  options: {
    required: boolean;
    visibility: "server-only" | "client-safe";
    expected: string;
  },
): string {
  return `${name} is invalid. ${describeEnvVariable(name, options)}`;
}

export function readEnvValue(
  source: EnvSource,
  name: string,
): string | undefined {
  const value = source[name];

  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}
