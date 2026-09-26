# Deployment

## Target

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
