# 0001 — Workspace and stack

## Status

Accepted

## Context

The site is a design standard for one character. It needs a rich, animated reading experience and a small API that serves structured content (traits, outfits, artworks, token catalog, sticker and PV rules). The frontend must follow Feature-Sliced Design and the backend Domain-Driven Design. Design tokens must have one source that both the UI and the API's token catalog read.

## Decision

- One pnpm workspace with four packages: `@lynn/tokens`, `@lynn/contracts`, `@lynn/backend`, `@lynn/frontend`.
- Frontend: a Vite + React SPA with React Router lazy routes, TanStack Query and Motion.
- Backend: Hono on Node.js, zod at the HTTP boundary, bundled by tsup into one ESM file.
- `@lynn/tokens` holds every token value and generates the CSS custom properties. `@lynn/contracts` holds route constants and DTO types only.
- One container serves the API under `/api/v1` and the built SPA.

## Consequences

- Token values and wire types cannot drift between frontend and backend.
- The production image needs no `node_modules`: the backend bundle carries its dependencies.
- There is no server rendering. Pages render client-side; the index and every route are static-cacheable.

## Alternatives considered

- **Next.js / server rendering.** Rejected: the content is small and static, and a separate DDD backend would duplicate the framework's own server.
- **Static site with Markdown content.** Rejected: the brief asks for a DDD backend, and the domain invariants (contrast, frame counts, one canonical outfit) are easier to enforce in code.

## References

- [`project/architecture.md`](../project/architecture.md)
