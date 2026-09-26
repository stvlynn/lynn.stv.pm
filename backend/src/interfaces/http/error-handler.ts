import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { NotFoundError, type Logger } from '../../application/shared';
import { DomainError } from '../../domain/shared';
import { fail } from './envelope';
import type { AppEnv } from './middleware/request-context';

/** Maps application and domain errors to the API envelope. */
export function errorHandler(logger: Logger): ErrorHandler<AppEnv> {
  return (error, context) => {
    const requestId = context.get('requestId');
    if (error instanceof NotFoundError) {
      return context.json(fail(error.code, error.message), 404);
    }
    if (error instanceof DomainError) {
      return context.json(fail(error.code, error.message), 422);
    }
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      const message = issue ? `${issue.path.join('.') || 'body'}: ${issue.message}` : 'Invalid request';
      return context.json(fail('VALIDATION_FAILED', message), 400);
    }
    logger.log('error', 'unhandled error', {
      requestId,
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    return context.json(fail('INTERNAL_ERROR', 'Something went wrong'), 500);
  };
}
