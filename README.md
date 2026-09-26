# lynn.stv.pm

The character standard for **Lynn**: identity and concept, the wardrobe, the art book, and the UI, sticker and PV specifications, presented as a drawing sheet with visual tokens.

Agents start with [`AGENTS.md`](AGENTS.md) (same file as `CLAUDE.md`).

## Sections

| Route             | Code   | Content                                                             |
| ----------------- | ------ | ------------------------------------------------------------------- |
| `/`               | LYN-00 | Drawing sheet: annotated line-art figure and section index.         |
| `/character`      | CHR-01 | Concept, principles, palette, proportion and the original sheet.    |
| `/wardrobe`       | WRD-02 | Six outfits with garments, palette and occasion.                    |
| `/gallery`        | ART-03 | Art book with 2.5D tilt plates and a lightbox.                      |
| `/specs/ui`       | SPC-04 | Color ramps, semantic tokens, contrast, type, scales, motion, beUI. |
| `/specs/stickers` | SPC-05 | Sticker canvas, rules, the full set and a prompt composer.          |
| `/specs/pv`       | SPC-06 | PV format, identity and costume lock, rules, pipeline and stills.   |

## Stack

- pnpm workspace: `@lynn/tokens`, `@lynn/contracts`, `@lynn/backend`, `@lynn/frontend`.
- Frontend (FSD): React 19, Vite 8, React Router, TanStack Query, Motion, beUI on Tailwind CSS 4.
- Backend (DDD): Hono 4, zod 4, bundled with tsup.
- Type: Instrument Serif, Newsreader, IBM Plex Mono.

## Commands

```bash
pnpm install
pnpm dev        # API on :8787, frontend on :5173 (proxies /api)
pnpm check      # typecheck, lint, format, tests, doc links
pnpm build      # frontend/dist and backend/dist
pnpm start      # serve API and built SPA from one process
```

Node.js 22 (`.nvmrc`).

## Structure

```text
packages/tokens      design tokens and generated CSS
packages/contracts   API routes and DTO types
backend/src          domain · application · infrastructure · interfaces
frontend/src         app · pages · widgets · features · entities · shared
frontend/public      media (outfits, artworks, stickers, PV stills)
deploy/docker        production image
docs/                conventions, architecture and ADRs
```

## Documentation

- [`docs/project/architecture.md`](docs/project/architecture.md) — packages, content flow, boundaries.
- [`docs/frontend/design-system.md`](docs/frontend/design-system.md) — tokens, themes, beUI binding.
- [`docs/backend/api-conventions.md`](docs/backend/api-conventions.md) — endpoints and envelope.
- [`docs/operations/README.md`](docs/operations/README.md) — local development and deployment.
- [`docs/decisions/README.md`](docs/decisions/README.md) — architecture decision records.
