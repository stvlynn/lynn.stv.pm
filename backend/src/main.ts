import { serve } from '@hono/node-server';
import { buildDependencies } from './composition';
import { readEnv } from './infrastructure/config/env';
import { createApp } from './interfaces/http';

const env = readEnv();
const dependencies = buildDependencies(env);
const app = createApp(dependencies);

serve({ fetch: app.fetch, port: env.PORT, hostname: env.HOST }, (info) => {
  dependencies.logger.log('info', 'server listening', { port: info.port, staticDir: env.STATIC_DIR ?? null });
});
