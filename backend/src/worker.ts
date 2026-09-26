import { buildDependencies } from './composition';
import type { Logger } from './application/shared';
import { createApp } from './interfaces/http';

const logger: Logger = {
  log(level, message, fields = {}) {
    console.log(JSON.stringify({ time: new Date().toISOString(), level, message, ...fields }));
  },
};

const app = createApp(buildDependencies(undefined, logger));

export default {
  fetch: app.fetch,
};
