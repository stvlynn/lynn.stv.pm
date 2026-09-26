# Architecture

## Overview

`lynn.stv.pm` is the character standard for Lynn: identity, wardrobe, art book, and the UI, sticker and PV specifications. It is a pnpm workspace with four packages:

| Package           | Path                  | Role                                                                                                           |
| ----------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `@lynn/tokens`    | `packages/tokens/`    | Single source of design tokens (ramps, semantic colors, type, space, radius, elevation, motion) and their CSS. |
| `@lynn/contracts` | `packages/contracts/` | API route constants and DTO types shared by backend and frontend. Types only.                                  |
| `@lynn/backend`   | `backend/`            | Hono HTTP API, DDD layers, serves the built SPA in production.                                                 |
| `@lynn/frontend`  | `frontend/`           | Vite + React SPA, Feature-Sliced Design.                                                                       |

```text
                    @lynn/tokens ───────────────┐
                         │                      │
   infrastructure/design-system adapter    app/styles/inject-tokens (CSS vars)
                         │                      │
Browser ──HTTP──▶ interfaces/http ──▶ application ──▶ domain      frontend (FSD)
   ▲              (Hono, zod)       (use cases)     (entities,       │
   │                   │                             value objects)  │ features/*/api
   │                   └──▶ infrastructure (content records,         │   └─ shared/api (fetch + envelope)
   │                        in-memory repositories, logger)          │
   └───────────────────────── /api/v1/* (@lynn/contracts DTOs) ◀─────┘
```

## Content flow

1. Content is authored as typed records in `backend/src/infrastructure/content/*.content.ts`.
2. In-memory repositories map records to domain aggregates at startup. Invalid content (bad hex, missing alt text, wrong frame count, two canonical outfits) fails fast with a `DomainError`.
3. Token-bound swatches (`token: '--lynn-ribbon'`) resolve their hex from `@lynn/tokens`, so content never duplicates a color value.
4. Application services map aggregates to `@lynn/contracts` DTOs. Interfaces wrap them in the API envelope.
5. Frontend `features/*/api` query the API through `shared/api` and hand DTO-shaped entities to widgets.

## Module boundaries

| Module                   | Responsibility                                                           |
| ------------------------ | ------------------------------------------------------------------------ |
| Frontend `app`           | Entry, providers (query client, next-themes, motion config), router.     |
| Frontend `pages`         | One per route; composes widgets, reads query state.                      |
| Frontend `widgets`       | Page blocks: drawing sheet, trait sheet, wardrobe stage, token catalog.  |
| Frontend `features`      | Scenarios with their API: explore wardrobe, compose a sticker prompt.    |
| Frontend `entities`      | DTO-backed types and pure helpers (trait grouping, bezier sampling).     |
| Frontend `shared`        | i18n, config, API client, beUI adapters, the blueprint figure.           |
| Backend `interfaces`     | Hono routes, zod input validation, envelope, error mapping, request log. |
| Backend `application`    | Use cases returning contract DTOs; `Logger` port.                        |
| Backend `domain`         | Aggregates, value objects, invariants, contrast domain service.          |
| Backend `infrastructure` | Content records, repositories, token adapter, env, JSON logger.          |

Boundaries are enforced by ESLint (`eslint.config.js`): FSD layer direction, same-layer slice isolation, public-API-only imports, and DDD dependency direction with framework-free `domain`.

## Technology

- Runtime: Node.js 22 (`.nvmrc`), pnpm 9 workspaces.
- Frontend: React 19, Vite 8, React Router 8 (lazy route chunks), TanStack Query 5, Motion 13, beUI components on Tailwind CSS 4, CSS Modules for page layout.
- Backend: Hono 4 on `@hono/node-server`, zod 4, bundled by tsup into a single ESM file.
- Persistence: none. Content is versioned in the repository; repositories are in-memory.
- Hosting: a Cloudflare Worker serving the Hono API with Workers Static Assets
  serving the SPA; the Docker image remains available for container hosting.

## Exceptions to the default rules

These are deliberate and approved:

- **Vendored beUI.** `frontend/src/shared/ui/beui/` holds beUI registry components copied verbatim. They import helpers through the `@/` alias, which points at that folder only. The folder is excluded from lint and formatting. See [ADR 0002](../decisions/0002-beui-component-library.md).
- **Frontend TypeScript flags.** `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are off in `frontend/tsconfig.json` because the vendored components and React typings do not satisfy them. The backend and packages keep both on.
- **Application DTOs are the wire contract.** `application/` returns `@lynn/contracts` types directly instead of defining a parallel DTO layer.

## Cross-cutting concerns

- **Theming.** `data-theme` on `<html>` (`light` whiteprint, `dark` blueprint). `index.html` resolves it before paint; `next-themes` owns it afterwards.
- **Errors.** Envelope and codes in [`backend/api-conventions.md`](../backend/api-conventions.md).
- **Logging.** One JSON line per request with a correlation id; see [`backend/logging.md`](../backend/logging.md).
- **Validation.** zod at the HTTP boundary, invariants in the domain.
