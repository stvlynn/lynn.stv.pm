import { API_PREFIX } from '@lynn/contracts';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { fail } from './envelope';
import { errorHandler } from './error-handler';
import { type AppEnv, requestContext } from './middleware/request-context';
import { contentRoutes } from './routes/content-routes';
import type { HttpDependencies } from './services';

export function createApp(dependencies: HttpDependencies): Hono<AppEnv> {
  const app = new Hono<AppEnv>();
  app.use('*', requestContext(dependencies.logger));
  app.onError(errorHandler(dependencies.logger));

  app.get('/health', (c) => c.json({ status: 'ok' }));
  app.route(API_PREFIX, contentRoutes(dependencies));
  app.all(`${API_PREFIX}/*`, (c) => c.json(fail('ROUTE_NOT_FOUND', 'No such endpoint'), 404));

  if (dependencies.staticDir) {
    const root = dependencies.staticDir;
    app.use(
      '/media/*',
      serveStatic({ root, onFound: (_path, c) => c.header('Cache-Control', 'public, max-age=86400') }),
    );
    app.use(
      '/assets/*',
      serveStatic({ root, onFound: (_path, c) => c.header('Cache-Control', 'public, max-age=31536000, immutable') }),
    );
    app.use('*', serveStatic({ root }));
    // Client-side routes fall back to the SPA entry.
    app.get('*', serveStatic({ root, path: 'index.html' }));
  }

  return app;
}
