# Deployment

## Cloudflare Worker

`wrangler.jsonc` deploys the Hono API and the built Vite SPA as one Worker at
`lynn.stv.pm`. Cloudflare serves static assets directly and invokes the Worker
for `/api/*` and `/health`. Client routes fall back to `index.html`.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm deploy:worker
```

Wrangler uses the authenticated Cloudflare account. The Worker name is
`lynn-stv-pm`; its custom domain is declared in `wrangler.jsonc`. To connect
the repository for automatic deployments, open the Worker in Cloudflare's
Workers & Pages dashboard, then select **Settings → Builds → Connect** and
choose `stvlynn/lynn.stv.pm`. Set the root directory to `/`, the build command
to `pnpm install --frozen-lockfile && pnpm build`, and the deploy command to
`pnpm exec wrangler deploy`. The dashboard Worker name must match the Wrangler
configuration name.

## Smoke test

After deploying, check both the static site and the API:

```sh
curl -f https://lynn.stv.pm/
curl -f https://lynn.stv.pm/character/
curl -f https://lynn.stv.pm/health
curl -f https://lynn.stv.pm/api/v1/character
```

## Container target

One container runs the Hono backend, which serves `/api/v1/*`, `/health`, `/media/*`, hashed `/assets/*` and the SPA with a fallback to `index.html` for client routes.

## Build

```sh
docker build -f deploy/docker/Dockerfile -t lynn-stv-pm .
```

The backend bundle inlines all dependencies, so the runtime stage copies `backend/dist`, `frontend/dist` and nothing else.

## Run

```sh
docker run --rm -p 8787:8787 lynn-stv-pm
```

## Caching

- `/assets/*` — `public, max-age=31536000, immutable` (content-hashed by Vite).
- `/media/*` — `public, max-age=86400`.

## Health checks

`GET /health` returns `{"status":"ok"}`. The image declares a `HEALTHCHECK` against it.

## Rollback

Redeploy the previous image tag. There is no persistent state to migrate.

## CI

`.github/workflows/ci.yml` installs with the frozen lockfile, runs `pnpm check`, then `pnpm build`.
