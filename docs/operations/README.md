# Operations

This section covers how the project is run, built, deployed, and monitored.

## Documents

- [`local-dev.md`](local-dev.md) — local development setup.
- [`deployment.md`](deployment.md) — deployment guide.

## Environment

- Runtime: Node.js 22, pnpm 9.
- Environment variables: `PORT`, `HOST`, `LOG_LEVEL`, `STATIC_DIR` (see [`local-dev.md`](local-dev.md)).
- Local services: none.

## Commands

```sh
pnpm install      # install
pnpm dev          # backend + frontend with reload
pnpm check        # typecheck, lint, format, tests, doc links
pnpm build        # production build
pnpm start        # serve the built backend
```
