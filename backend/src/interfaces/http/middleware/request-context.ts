import { randomUUID } from 'node:crypto';
import type { MiddlewareHandler } from 'hono';
import type { Logger } from '../../../application/shared';

export type AppEnv = { Variables: { requestId: string } };

const REQUEST_ID_HEADER = 'x-request-id';
const REQUEST_ID_PATTERN = /^[A-Za-z0-9-]{8,64}$/;

/** Assigns a correlation id and logs one structured line per request. */
export function requestContext(logger: Logger): MiddlewareHandler<AppEnv> {
  return async (context, next) => {
    const incoming = context.req.header(REQUEST_ID_HEADER);
    const requestId = incoming && REQUEST_ID_PATTERN.test(incoming) ? incoming : randomUUID();
    context.set('requestId', requestId);
    const started = performance.now();
    await next();
    context.header(REQUEST_ID_HEADER, requestId);
    logger.log('info', 'request handled', {
      requestId,
      method: context.req.method,
      path: context.req.path,
      status: context.res.status,
      durationMs: Math.round(performance.now() - started),
    });
  };
}
