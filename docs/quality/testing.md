# Testing

## Test pyramid

1. **Unit tests** — fast, isolated tests for domain logic and pure functions.
2. **Integration tests** — verify repositories, external-service clients, and API endpoints against real or test doubles.
3. **End-to-end tests** — verify critical user journeys through the full stack.

## Unit tests

- Place unit tests next to the source file or in a `__tests__` directory.
- Test domain invariants and edge cases thoroughly.
- Do not test framework code.

## Integration tests

- Use a test database or in-memory equivalent.
- Reset state between tests.
- Test the boundary between layers (e.g., repository mapping).

## End-to-end tests

- Cover the most important user journeys only.
- Keep them stable and fast enough to run in CI.
- Use deterministic test data.

## Test data

- Use factories, not fixtures, for test data.
- Avoid shared mutable state between tests.

## Naming

- Test descriptions should read like specifications: `it('rejects a negative amount')`.
- Group tests by behavior, not by method name.

## Coverage

- Aim for high coverage of domain and application layers.
- Do not chase 100% coverage at the expense of meaningful tests.

## Suites in this repository

Run everything with `pnpm test` (Vitest in each package).

| Package           | Covers                                                                                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/tokens` | Every ramp step and semantic token is emitted; dark overrides are complete; references resolve to hex.                                         |
| `backend`         | Value objects, contrast math, frame-count and timecode rules, sticker prompt rules, wardrobe ordering; HTTP integration through `app.request`. |
| `frontend`        | i18n lookup, sticker filtering, bezier sampling, callout label spacing.                                                                        |

Visual changes are reviewed with Playwright screenshots of every route in both themes and at 390 px width; no page may scroll horizontally.
