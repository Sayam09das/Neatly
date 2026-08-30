import {
  type Actor,
  assertOwnerOrAdmin,
  requireAdminActor,
  type SessionCustomerIdentity,
} from "../../lib/domain/actor.ts";
import { customerNotFound } from "../../lib/domain/errors.ts";
import {
  type ListResult,
  resolvePagination,
  resolveSort,
  toListResult,
} from "../../lib/domain/list.ts";
import {
  AuthorizationError,
  ConflictError,
  ValidationError,
} from "../../lib/errors.ts";
import { parseWithSchema } from "../../lib/validations/parse.ts";
import { emailSchema } from "../../lib/validations/primitives.ts";
import type { CustomerRepository } from "../../repositories/customer.repository.ts";
import {
  type CreateCustomerInput,
  CUSTOMER_SORT_FIELDS,
  type CustomerListQuery,
  type CustomerProfileView,
  type CustomerRecord,
  type CustomerStats,
  toCustomerProfileView,
  type UpdateCustomerInput,
  type UpdateCustomerProfileInput,
} from "./customer.types.ts";

export class CustomerService {
  private readonly customers: CustomerRepository;

  public constructor(customers: CustomerRepository) {
    this.customers = customers;
  }

  public async create(
    actor: Actor,
    input: CreateCustomerInput,
  ): Promise<CustomerRecord> {
    requireAdminActor(actor);
    const email = parseWithSchema(emailSchema, input.email);
    const existing = await this.customers.findByEmail(email);

    if (existing !== null) {
      throw new ConflictError("A customer with this email already exists.");
    }

    const name = requireName(input.name);
    return this.customers.create({
      address: emptyToNull(input.address),
      avatarMediaId: input.avatarMediaId ?? null,
      email,
      name,
      phone: emptyToNull(input.phone),
      userId: input.userId ?? null,
    });
  }

  public async findUserIdByEmail(email: string): Promise<string | null> {
    const customer = await this.customers.findByEmail(
      email.trim().toLowerCase(),
    );
    return customer?.userId ?? null;
  }

  public async getById(actor: Actor, id: string): Promise<CustomerRecord> {
    const customer = await this.customers.findById(id);

    if (customer === null) {
      throw customerNotFound();
    }

    assertOwnerOrAdmin(actor, customer.userId);
    return customer;
  }

  public async list(
    actor: Actor,
    query: CustomerListQuery = {},
  ): Promise<ListResult<CustomerRecord>> {
    requireAdminActor(actor);
    const pagination = resolvePagination(query.pagination);
    const sort = resolveSort(query.sort, CUSTOMER_SORT_FIELDS);
    const result = await this.customers.list({ ...query, pagination, sort });
    return toListResult(result.items, result.total, pagination);
  }

  public async update(
    actor: Actor,
    id: string,
    input: UpdateCustomerInput,
  ): Promise<CustomerRecord> {
    const customer = await this.getById(actor, id);

    if (input.email !== undefined) {
      const email = parseWithSchema(emailSchema, input.email);
      const existing = await this.customers.findByEmail(email);

      if (existing !== null && existing.id !== customer.id) {
        throw new ConflictError("A customer with this email already exists.");
      }
    }

    const updated = await this.customers.update(id, {
      address:
        input.address === undefined ? undefined : emptyToNull(input.address),
      avatarMediaId: input.avatarMediaId,
      email:
        input.email === undefined
          ? undefined
          : parseWithSchema(emailSchema, input.email),
      name: input.name === undefined ? undefined : requireName(input.name),
      phone: input.phone === undefined ? undefined : emptyToNull(input.phone),
    });

    if (updated === null) {
      throw customerNotFound();
    }

    return updated;
  }

  public async deactivate(actor: Actor, id: string): Promise<CustomerRecord> {
    requireAdminActor(actor);
    const customer = await this.customers.findById(id);

    if (customer === null) {
      throw customerNotFound();
    }

    const updated = await this.customers.update(id, { status: "INACTIVE" });

    if (updated === null) {
      throw customerNotFound();
    }

    return updated;
  }

  public async activate(actor: Actor, id: string): Promise<CustomerRecord> {
    requireAdminActor(actor);
    const customer = await this.customers.findById(id);

    if (customer === null) {
      throw customerNotFound();
    }

    const updated = await this.customers.update(id, { status: "ACTIVE" });

    if (updated === null) {
      throw customerNotFound();
    }

    return updated;
  }

  public async stats(actor: Actor): Promise<CustomerStats> {
    requireAdminActor(actor);
    const [total, active] = await Promise.all([
      this.customers.countTotal(),
      this.customers.countByStatus("ACTIVE"),
    ]);

    return {
      active,
      inactive: total - active,
      total,
    };
  }

  public async getForSession(
    actor: Actor,
    identity: SessionCustomerIdentity,
  ): Promise<CustomerProfileView> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.ensureForSession(identity);
    return toCustomerProfileView(customer);
  }

  public async updateForSession(
    actor: Actor,
    identity: SessionCustomerIdentity,
    input: UpdateCustomerProfileInput,
  ): Promise<CustomerProfileView> {
    this.assertCustomerActor(actor, identity);
    const customer = await this.ensureForSession(identity);
    const updated = await this.customers.update(customer.id, {
      address:
        input.address === undefined ? undefined : emptyToNull(input.address),
      name: input.name === undefined ? undefined : requireName(input.name),
      phone: input.phone === undefined ? undefined : emptyToNull(input.phone),
    });

    if (updated === null) {
      throw customerNotFound();
    }

    return toCustomerProfileView(updated);
  }

  public async ensureForSession(
    identity: SessionCustomerIdentity,
  ): Promise<CustomerRecord> {
    const byUser = await this.customers.findByUserId(identity.id);

    if (byUser !== null) {
      if (byUser.status !== "ACTIVE") {
        throw new ConflictError("This customer is not active.");
      }

      return byUser;
    }

    const byEmail = await this.customers.findByEmail(identity.email);

    if (byEmail !== null) {
      if (byEmail.userId !== null && byEmail.userId !== identity.id) {
        throw new ConflictError("This account cannot be used.");
      }

      const linked = await this.customers.update(byEmail.id, {
        userId: identity.id,
      });

      if (linked === null || linked.status !== "ACTIVE") {
        throw new ConflictError("This customer is not active.");
      }

      return linked;
    }

    return this.customers.create({
      email: identity.email,
      name: identity.name,
      userId: identity.id,
    });
  }

  private assertCustomerActor(
    actor: Actor,
    identity: SessionCustomerIdentity,
  ): void {
    if (actor.id !== identity.id || actor.role !== "CUSTOMER") {
      throw new AuthorizationError();
    }
  }
}

function requireName(name: string): string {
  const trimmed = name.trim();

  if (trimmed === "") {
    throw new ValidationError("Validation failed.", [
      { field: "name", issue: "Enter a name." },
    ]);
  }

  return trimmed;
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}
