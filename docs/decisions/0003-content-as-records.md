# 0003 — Content as in-repository records

## Status

Accepted

## Context

The standard's content changes with the character design, not with user activity. It must be reviewed like code, and invalid content (a color with poor contrast, a PV format whose frame count does not match its duration, two canonical outfits) must be caught before deploy.

## Decision

- Content is typed records in `backend/src/infrastructure/content/*.content.ts`.
- In-memory repositories map records to domain aggregates when the app is composed. Domain invariants throw `DomainError`, so bad content fails startup and the test suite.
- Swatches bound to a token (`token: '--lynn-ribbon'`) resolve their hex from `@lynn/tokens`.
- Media lives in `frontend/public/media/` and is referenced by path.

## Consequences

- No database, migrations or admin UI. Editing content is a pull request.
- Every content change is validated by `pnpm test`.
- Repositories sit behind domain ports, so a persistent store can replace them without touching application code.

## Alternatives considered

- **Headless CMS.** Rejected: adds a runtime dependency and loses type checking for a single-author site.
- **JSON or Markdown files.** Rejected: loses the compile-time link between records and domain factories.

## References

- [`backend/infrastructure.md`](../backend/infrastructure.md)
- [`backend/database.md`](../backend/database.md)
