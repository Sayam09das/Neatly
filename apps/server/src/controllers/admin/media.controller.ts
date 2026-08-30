import type { IncomingMessage, ServerResponse } from "node:http";
import { HTTP_STATUS } from "../../config/constants.ts";
import { actorFromContext } from "../../lib/domain/http-actor.ts";
import { getDomainServices } from "../../lib/domain/runtime.ts";
import { sendSuccess } from "../../lib/http.ts";
import { readMediaUploadForm } from "../../lib/multipart.ts";
import type { RequestContext } from "../../lib/request-context.ts";

export async function uploadMediaController(
  req: IncomingMessage,
  res: ServerResponse,
  context: RequestContext,
): Promise<void> {
  actorFromContext(context);
  const form = await readMediaUploadForm(req);
  const media = await getDomainServices().media.uploadThumbnail({
    altText: form.altText,
    body: form.file.body,
    filename: form.file.filename,
    mimeType: form.file.mimeType,
  });
  sendSuccess(
    res,
    {
      media: {
        altText: media.altText,
        id: media.id,
        url: media.url,
      },
    },
    { statusCode: HTTP_STATUS.CREATED },
  );
}
