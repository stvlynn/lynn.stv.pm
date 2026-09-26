# Decisions

This section records architecture decision records (ADRs). Each ADR explains why a significant decision was made and what alternatives were considered.

## When to write an ADR

Write an ADR when the decision:

- Is hard to reverse.
- Affects multiple layers or teams.
- Has non-obvious trade-offs.

## Existing decisions

- [`0001-workspace-and-stack.md`](0001-workspace-and-stack.md) — pnpm workspace, Vite React SPA, Hono API, shared tokens and contracts.
- [`0002-beui-component-library.md`](0002-beui-component-library.md) — vendored beUI components on Tailwind CSS 4.
- [`0003-content-as-records.md`](0003-content-as-records.md) — content as typed records with in-memory repositories.
- [`0004-line-art-figure-pipeline.md`](0004-line-art-figure-pipeline.md) — traced line art for the drawing sheet.
- [`adr-template.md`](adr-template.md) — template for new ADRs.

## Naming

Use a sequential number and a short kebab-case title:

```
decisions/
  0001-workspace-and-stack.md
  0002-beui-component-library.md
```
