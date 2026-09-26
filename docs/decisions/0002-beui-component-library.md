# 0002 — beUI as the component library

## Status

Accepted

## Context

Interactive UI (buttons, tabs, switch, input, modal, drawer, tooltip, theme toggle, tilt card, text and number animation) should come from beUI rather than hand-written components. beUI is a shadcn-style registry: components are copied into the project, not installed as a package. The registry host (`beui.dev`) is not reachable from the build environment.

## Decision

- beUI components are vendored verbatim into `frontend/src/shared/ui/beui/`, taken from the beUI MCP server's `get_component` output.
- Their `@/` imports resolve through a Vite and TypeScript alias that points at that folder only.
- Tailwind CSS 4 is added for these components. `app/styles/tailwind.css` maps the shadcn token names (`--background`, `--primary`, `--ring`, …) to `componentAliases` from `@lynn/tokens`, so beUI reads the Lynn palette in both themes.
- Project code never imports from `beui/` directly outside `shared/ui`. `shared/ui` adapters (`Button`, `Tag`, `Switch`, `TextField`, `SegmentedControl`, `Dialog`, `CopyValue`) map the design-system API onto beUI props.
- The vendored folder is excluded from ESLint and Prettier. `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` are off in `frontend/tsconfig.json` because the vendored code does not satisfy them.
- Global element styles live in `@layer base` so Tailwind utilities win over them.

## Consequences

- Updating a component means re-fetching it from the MCP server and replacing the file; local edits to vendored files are not allowed.
- The frontend type-checks with two strict flags fewer than the backend and packages.
- Two styling systems coexist: CSS Modules for page layout, Tailwind utilities inside beUI.

## Alternatives considered

- **`shadcn add` from the registry URL.** Not possible: the host is blocked from the build environment.
- **Hand-written components.** Rejected by the brief.
- **Patching vendored files to pass the strict flags.** Rejected: it makes upstream updates a merge job.

## References

- [`frontend/design-system.md`](../frontend/design-system.md)
- [`project/architecture.md`](../project/architecture.md)
