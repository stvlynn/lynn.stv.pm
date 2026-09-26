# Project

This section describes what the site is, who it serves, and how its parts fit together.

## Documents

- [`architecture.md`](architecture.md) — packages, layers, content flow, technology and approved exceptions.

## What it is

`lynn.stv.pm` is the standard for **Lynn**, the original character of Steven Lynn (current design by YAYOI の 夢). It presents:

- **Drawing sheet** (`/`) — a line-art front elevation of Lynn, plotted on load and annotated like an engineering drawing.
- **Character** (`/character`) — specification, principles, identity traits (linked to callouts on the drawing), palette, proportion, reference sheet and the "never" list.
- **Wardrobe** (`/wardrobe?look=<id>`) — six sanctioned outfits, one canonical.
- **Art book** (`/gallery`) — finished illustrations on tilt plates with a lightbox.
- **UI specification** (`/specs/ui`) — the live token catalog with contrast checks, type, space, radius, elevation, motion and components.
- **Sticker specification** (`/specs/stickers`) — canvas, rules, a server-side prompt composer and the full sticker set.
- **PV specification** (`/specs/pv`) — delivery format, identity and costume lock, rules, pipeline and stills from the Trick Heart cover.

## Goals

- One authoritative, linkable reference for anyone drawing, animating or designing with Lynn.
- Every visible value (colors, type, motion) is the value the site itself runs on.

## Non-goals

- No accounts, uploads or editing UI. Content changes through pull requests.
- No commercial licensing flow. Stickers are CC BY 4.0 with the author's non-commercial request.

## Related repositories

- `stvlynn/navy-ink-design-system` — source of the ink / cornflower ramps and UI principles.
- `stvlynn/sticker` — source of the sticker set, prompt template and license.
- `stvlynn/trick-art` — the Trick Heart PV production, source of the PV rules and stills.
