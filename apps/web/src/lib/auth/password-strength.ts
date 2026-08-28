import { AUTH_PASSWORD_MIN_LENGTH } from "@/config/auth";

export const PASSWORD_STRENGTH_LABELS = {
  fair: "Fair",
  good: "Good",
  strong: "Strong",
  weak: "Weak",
} as const;

export type PasswordStrength = keyof typeof PASSWORD_STRENGTH_LABELS;

const PASSWORD_STRENGTH_GOOD_LENGTH = 16;
const PASSWORD_HAS_LOWER_AND_UPPER = /(?:[a-z].*[A-Z])|(?:[A-Z].*[a-z])/;
const PASSWORD_HAS_DIGIT = /\d/;
const PASSWORD_HAS_SYMBOL = /[^A-Za-z0-9]/;

export const PASSWORD_STRENGTH_LEVELS = [
  "weak",
  "fair",
  "good",
  "strong",
] as const satisfies ReadonlyArray<PasswordStrength>;

export function getPasswordStrength(password: string): PasswordStrength | null {
  if (password.length === 0) {
    return null;
  }

  let score = 0;

  if (password.length >= AUTH_PASSWORD_MIN_LENGTH) {
    score += 1;
  }

  if (password.length >= PASSWORD_STRENGTH_GOOD_LENGTH) {
    score += 1;
  }

  if (PASSWORD_HAS_LOWER_AND_UPPER.test(password)) {
    score += 1;
  }

  if (PASSWORD_HAS_DIGIT.test(password)) {
    score += 1;
  }

  if (PASSWORD_HAS_SYMBOL.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return "weak";
  }

  if (score === 2) {
    return "fair";
  }

  if (score === 3) {
    return "good";
  }

  return "strong";
}

export function getPasswordStrengthCount(
  strength: PasswordStrength | null,
): number {
  if (strength === null) {
    return 0;
  }

  return PASSWORD_STRENGTH_LEVELS.indexOf(strength) + 1;
}
