import type { IncomingMessage, ServerResponse } from "node:http";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import {
  getValidatedParams,
  getValidatedQuery,
  type RequestContext,
} from "../../lib/request-context.ts";
import type {
  BlogListQueryInput,
  NewsletterListQueryInput,
  PortfolioListQueryInput,
} from "../../lib/validations/admin.schema.ts";

export async function listBlogPostsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().cms.listBlogPosts(
    actorFromContext(context),
    getValidatedQuery<BlogListQueryInput>(context),
  );
  sendSuccess(res, result);
}

export async function getBlogPostController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const post = await getDomainServices().cms.getBlogPost(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { post });
}

export async function listPortfolioProjectsController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().cms.listPortfolioProjects(
    actorFromContext(context),
    getValidatedQuery<PortfolioListQueryInput>(context),
  );
  sendSuccess(res, result);
}

export async function getPortfolioProjectController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const project = await getDomainServices().cms.getPortfolioProject(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { project });
}

export async function listNewsletterSubscribersController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const result = await getDomainServices().cms.listNewsletterSubscribers(
    actorFromContext(context),
    getValidatedQuery<NewsletterListQueryInput>(context),
  );
  sendSuccess(res, result);
}

export async function getNewsletterSubscriberController(
  _req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  const { id } = getValidatedParams<{ id: string }>(context);
  const subscriber = await getDomainServices().cms.getNewsletterSubscriber(
    actorFromContext(context),
    id,
  );
  sendSuccess(res, { subscriber });
}
