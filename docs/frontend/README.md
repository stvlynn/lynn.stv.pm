# Frontend

This section defines how the frontend is organized using **Feature-Sliced Design (FSD)**.

## Documents

- [`fsd-overview.md`](fsd-overview.md) — what FSD is and why it is used.
- [`layers.md`](layers.md) — responsibilities of each FSD layer.
- [`slices.md`](slices.md) — how to split code into slices.
- [`segments.md`](segments.md) — `ui`, `model`, `lib`, `api`, `config` segments.
- [`public-api.md`](public-api.md) — public API and re-export rules.
- [`import-rules.md`](import-rules.md) — cross-layer and cross-slice import rules.
- [`ui-patterns.md`](ui-patterns.md) — semantic styling, no hardcoded copy, no redundant copy.
- [`design-system.md`](design-system.md) — tokens, beUI components, the drawing sheet figure and motion.
- [`mobile-feedback.md`](mobile-feedback.md) — tilt permissions, calibration and touch feedback.
- [`artwork-depth.md`](artwork-depth.md) — art book depth assets, pointer parallax and verification.
- [`../quality/agent-skills.md`](../quality/agent-skills.md) — Agent Skills for UI craft, motion, and anti-slop.

- [`social-metadata.md`](social-metadata.md) — favicon, crawler-readable page metadata and share-card generation.

## Quick start

1. Read [`fsd-overview.md`](fsd-overview.md) if FSD is new to you.
2. Read [`layers.md`](layers.md) to understand where a new file belongs.
3. Read [`import-rules.md`](import-rules.md) before adding any import.
4. Read [`ui-patterns.md`](ui-patterns.md) before writing UI code.
5. Apply the Agent Skills in [`../quality/agent-skills.md`](../quality/agent-skills.md) when the work is visual or motion-related.

## Core principle

Code is organized by **scope of change**, not by technical type. A feature contains everything it needs — UI, state, API, and utilities — so that changes to one feature do not leak into unrelated files.
