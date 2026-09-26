# Design system in the frontend

How tokens, beUI components, CSS Modules and motion fit together.

## Tokens

- Source: `packages/tokens` (`palette.ts`, `semantic.ts`, `scales.ts`).
- `app/styles/inject-tokens.ts` writes `buildTokenCss()` into a `<style>` before the first render. Light values sit on `:root`; dark overrides sit under `:root[data-theme='dark']`.
- The UI specification page reads the same tokens through the API (`GET /api/v1/specs/ui`), so what is documented is what is running.
- Style with semantic tokens (`--color-text`, `--color-surface`, `--color-accent`, `--color-blueprint-line`). Ramp steps (`--ink-800`) are for illustration and diagrams only.

## beUI components

UI primitives come from [beUI](https://beui.dev), vendored in `shared/ui/beui/` (see [ADR 0002](../decisions/0002-beui-component-library.md)).

- beUI styles against the shadcn token names (`--background`, `--primary`, `--border`…). `componentAliases` in `@lynn/tokens` binds them to Lynn's semantic tokens; `app/styles/tailwind.css` registers the matching Tailwind utilities.
- Slices do not import `@/components/...` directly. `shared/ui` exposes adapters with Lynn's variants: `Button`, `ButtonLink` (SPA navigation), `Tag` (Animated Badge), `Switch`, `TextField` (Input), `SegmentedControl` (Tabs), `Dialog` (Center Morph Modal), plus re-exports of `TiltCard`, `TextReveal`, `NumberTicker`, `AnimatedNumber`, `Tooltip` and `Drawer`.
- Adding a component: fetch it from the beUI registry (MCP `get_component`, or `pnpm dlx shadcn add @beui/<slug>` where the network allows), copy its files unmodified under `shared/ui/beui/`, then export an adapter from `shared/ui`.
- Base element styles live in `@layer base` (`app/styles/global.css`) so Tailwind utilities on beUI components win over them. Page and widget layout stays in CSS Modules.

## The drawing sheet figure

- `shared/ui/blueprint/lineart.ts` is generated: an image-model redraw of the signature outfit (`frontend/scripts/lineart/source.png`) vectorized with potrace by `frontend/scripts/lineart/vectorize.py`. Do not edit it by hand; regenerate it.
- `figure.ts` holds the geometry the annotations depend on: head unit (crown to chin), hem width, the glasses overlay (the source drawing omits them) and `traitAnchors`, keyed by API trait id.
- `FigureDrawing` reveals the figure with a plotter-style scan mask, then fades in callouts laid out by `placeCallouts` (no two labels closer than `LABEL_GAP`). If you regenerate the line art, re-check every anchor against a gridded render.

## Motion

- Durations and easings come from tokens (`shared/lib/motion.ts` converts them for Motion). beUI components carry their own springs.
- `MotionConfig reducedMotion="user"` is set in `app`; components also read `useReducedMotion` and render the end state.
- Route changes cross-fade in `widgets/app-shell`. Do not put `initial={false}` on that `AnimatePresence`: it disables every first-load animation below it.
- Theme changes repaint through the View Transition API (beUI Theme Toggle, `blinds` variant).
