import type { CleanerStatus } from "@prisma/client";
import type { AuthUserRecord } from "../../lib/auth/repository.ts";
import type { AuthSessionResult } from "../../lib/auth/types.ts";
import type { PaginationQuery, SortQuery } from "../../lib/query.ts";
import type {
  CleanerInvitationInspection,
  CreateInvitedStaffUserResult,
} from "../auth.service.ts";

export const CLEANER_SORT_FIELDS = [
  "createdAt",
  "email",
  "name",
  "status",
] as const;

export const CLEANER_ACCOUNT_STATES = [
  "ACTIVE",
  "INACTIVE",
  "INVITED",
] as const;

export type CleanerAccountState = (typeof CLEANER_ACCOUNT_STATES)[number];

export interface CleanerInvitationGateway {
  activateCleanerInvitation(
    input: unknown,
    context: { ip: string },
  ): Promise<AuthSessionResult>;
  createInvitedStaffUser(input: {
    email: string;
    name: string;
  }): Promise<CreateInvitedStaffUserResult>;
  findUserByEmail(email: string): Promise<AuthUserRecord | null>;
  findUserById(id: string): Promise<AuthUserRecord | null>;
  inspectCleanerInvitation(token: string): Promise<CleanerInvitationInspection>;
  resendCleanerInvitation(
    userId: string,
    context: { ip: string },
  ): Promise<boolean>;
  revokeAllSessions(userId: string): Promise<void>;
  setUserStatus(
    userId: string,
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
  ): Promise<void>;
}

export const CLEANER_WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type CleanerWeekday = (typeof CLEANER_WEEKDAYS)[number];

export interface CleanerWeekDayAvailability {
  available: boolean;
  day: CleanerWeekday;
  end: string | null;
  start: string | null;
}

export interface CleanerAvailabilityConflict {
  date: string;
  jobId: string;
  serviceName: string | null;
}

export interface CleanerAvailabilityView {
  conflicts: CleanerAvailabilityConflict[];
  week: CleanerWeekDayAvailability[];
}

export interface CleanerRecord {
  accountState: CleanerAccountState;
  availability: unknown | null;
  createdAt: Date;
  email: string | null;
  emailVerifiedAt: Date | null;
  id: string;
  name: string;
  phone: string | null;
  status: CleanerStatus;
  updatedAt: Date;
  userId: string | null;
}

export interface CreateCleanerInput {
  email?: string | null;
  emailVerifiedAt?: Date | null;
  name: string;
  phone?: string | null;
  status?: CleanerStatus;
  userId?: string | null;
}

export interface InviteCleanerInput {
  email: string;
  name: string;
  phone: string;
}

export interface InviteCleanerResult {
  cleaner: CleanerRecord;
  invitationSent: boolean;
}

export interface ActivateCleanerInvitationResult {
  expiresAt: Date;
  sessionToken: string;
  user: AuthSessionResult["user"];
}

export interface UpdateCleanerInput {
  availability?: unknown | null;
  email?: string | null;
  emailVerifiedAt?: Date | null;
  name?: string;
  phone?: string | null;
}

export interface CleanerListQuery {
  accountState?: CleanerAccountState;
  pagination?: PaginationQuery;
  search?: string;
  sort?: SortQuery;
  status?: CleanerStatus;
}

export interface CleanerStats {
  active: number;
  inactive: number;
  total: number;
}

export interface CleanerSessionView {
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  status: CleanerStatus;
}

export function toCleanerSessionView(
  record: CleanerRecord,
): CleanerSessionView {
  return {
    email: record.email,
    id: record.id,
    name: record.name,
    phone: record.phone,
    status: record.status,
  };
}

export function deriveCleanerAccountState(input: {
  emailVerifiedAt: Date | null;
  status: CleanerStatus;
  userId: string | null;
}): CleanerAccountState {
  if (
    input.userId !== null &&
    input.emailVerifiedAt === null &&
    input.status === "INACTIVE"
  ) {
    return "INVITED";
  }

  if (input.status === "ACTIVE") {
    return "ACTIVE";
  }

  return "INACTIVE";
}

export function toCleanerRecord(input: {
  availability: unknown | null;
  createdAt: Date;
  email: string | null;
  emailVerifiedAt?: Date | null;
  id: string;
  name: string;
  phone: string | null;
  status: CleanerStatus;
  updatedAt: Date;
  userId: string | null;
}): CleanerRecord {
  const emailVerifiedAt = input.emailVerifiedAt ?? null;

  return {
    accountState: deriveCleanerAccountState({
      emailVerifiedAt,
      status: input.status,
      userId: input.userId,
    }),
    availability: input.availability,
    createdAt: input.createdAt,
    email: input.email,
    emailVerifiedAt,
    id: input.id,
    name: input.name,
    phone: input.phone,
    status: input.status,
    updatedAt: input.updatedAt,
    userId: input.userId,
  };
}
