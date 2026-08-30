import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { loadApiEnv } from "../../config/env.ts";
import { AuthError } from "../../lib/auth/errors.ts";
import { toAppErrorFromAuth } from "../../lib/auth/http-error.ts";
import { getAuthService } from "../../lib/auth/runtime.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendFailure, sendSuccess } from "../../lib/http.ts";
import {
  getValidatedBody,
  type RequestContext,
} from "../../lib/request-context.ts";
import type { RegisterUserInput } from "../../lib/validations/auth.schema.ts";

export async function registerCustomerController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  try {
    const body = getValidatedBody<RegisterUserInput>(context);
    const user = await getAuthService().registerUser(body, {
      role: "STAFF",
    });
    await getDomainServices().customers.ensureForSession({
      email: user.email,
      id: user.id,
      name: user.name,
    });
    sendSuccess(res, { user }, { statusCode: HTTP_STATUS.CREATED });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      sendFailure(
        res,
        toAppErrorFromAuth(error),
        loadApiEnv().nodeEnv,
        context.requestId,
      );
      return;
    }

    throw error;
  }
}
