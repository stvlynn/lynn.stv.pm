# docker

`Dockerfile` builds a single image: the Hono backend serves `/api/v1/*`, `/health`, and the built frontend (with a client-route fallback to `index.html`).

```sh
docker build -f deploy/docker/Dockerfile -t lynn-stv-pm .
docker run --rm -p 8787:8787 lynn-stv-pm
```

Runtime environment: `PORT` (8787), `HOST` (0.0.0.0), `LOG_LEVEL` (info), `STATIC_DIR` (/app/public).
