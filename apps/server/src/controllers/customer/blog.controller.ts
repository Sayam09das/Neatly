import type { IncomingMessage, ServerResponse } from "node:http";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  PublicBlogListQueryInput,
  PublicBlogSlugParam,
} from "../../lib/validations/public-blog.schema.ts";

export async function listPublicBlogPostsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().cms.listPublicBlogPosts(
    getValidatedQuery<PublicBlogListQueryInput>(context),
  );
  sendSuccess(res, result);
}

export async function getPublicBlogPostController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { slug } = getValidatedParams<PublicBlogSlugParam>(context);
  const post = await getDomainServices().cms.getPublicBlogPostBySlug(slug);
  sendSuccess(res, { post });
}
