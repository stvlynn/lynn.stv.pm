import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  outDir: 'dist',
  clean: true,
  sourcemap: true,
  // Workspace packages ship TypeScript source; runtime deps are bundled too so
  // the production image runs `node dist/main.js` with no install step.
  noExternal: [/^@lynn\//, 'hono', /^@hono\//, 'zod'],
});
