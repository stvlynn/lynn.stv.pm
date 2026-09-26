# Local Development

## Prerequisites

- Node.js 22 (`.nvmrc`)
- pnpm 9 (`corepack enable`)

No database, cache or broker: content ships in the repository.

## Setup

```sh
make dev          # install dependencies, then run backend on :8787 and frontend on :5173
```

Run `make install` to install workspace dependencies without starting the development servers.

Vite proxies `/api` to the backend. Media under `frontend/public/media` is served by Vite in development and by the backend in production.

## Environment variables

| Variable     | Required | Default   | Description                                              |
| ------------ | -------- | --------- | -------------------------------------------------------- |
| `PORT`       | no       | `8787`    | Backend port.                                            |
| `HOST`       | no       | `0.0.0.0` | Backend bind address.                                    |
| `LOG_LEVEL`  | no       | `info`    | `debug`, `info`, `warn` or `error`.                      |
| `STATIC_DIR` | no       | unset     | Directory of the built frontend. Set in production only. |

## Checks

```sh
pnpm check        # typecheck + lint + format check + tests + doc links
pnpm build        # frontend (Vite) then backend (tsup)
pnpm start        # run the built backend (set STATIC_DIR=../frontend/dist to serve the SPA)
```

## Regenerating the drawing-sheet figure

Requires `potrace` and Python with Pillow and svgpathtools:

```sh
python3 frontend/scripts/lineart/vectorize.py
```

Re-check `traitAnchors` in `frontend/src/shared/ui/blueprint/figure.ts` afterwards.

## Common issues

- **Animations never play on first load.** Look for `initial={false}` on an ancestor `AnimatePresence`.
- **A beUI component looks unstyled.** Its classes must be generated: `app/styles/tailwind.css` scans `shared/ui/beui` with `@source`; add another `@source` if components move.
