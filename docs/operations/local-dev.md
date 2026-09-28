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

Then regenerate the pen paths used by the entrance animation. This step needs Python with Pillow, numpy, scipy and scikit-image, plus the workspace Playwright dependency and installed Google Chrome:

```sh
python3 frontend/scripts/lineart/trace-strokes.py
```

The script renders the final vector ink and its silhouette, extracts the skeleton, and separates contour, structure and detail strokes before following connected lines. `frontend/scripts/lineart/drawing-order.json` is the editable art-direction map for facial features and accessories; update its polygons when the source changes. Nearby-stroke ordering applies only within a phase. It writes `frontend/src/shared/ui/blueprint/generated/front-strokes.ts`; do not edit this output by hand.

Re-check `traitAnchors` in `frontend/src/shared/ui/blueprint/figure.ts` afterwards.

For color artwork or silhouette changes, run the browser regression against the running dev server:

```sh
node frontend/scripts/lineart/verify-color.mjs
```

Set `CHARACTER_PREVIEW_URL` to test another local port. The check covers front hair/face fill, exterior exclusion, all four views and both themes. Visually inspect hair tips at full size and zoomed in as well.

## Common issues

- **Animations never play on first load.** Look for `initial={false}` on an ancestor `AnimatePresence`.
- **A beUI component looks unstyled.** Its classes must be generated: `app/styles/tailwind.css` scans `shared/ui/beui` with `@source`; add another `@source` if components move.
