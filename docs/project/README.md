# Project

This section describes what the site is, who it serves, and how its parts fit together.

## Documents

- [`architecture.md`](architecture.md) — packages, layers, content flow, technology and approved exceptions.

## What it is

`lynn.stv.pm` is the standard for **Lynn**, the original character of Steven Lynn. It presents:

- **Drawing sheet** (`/`) — a line-art front elevation of Lynn, plotted on load and annotated like an engineering drawing.
- **Character** (`/character`) — specification, principles, identity traits (four colored SVG views with synchronized callouts and proportion measurements, with proportion notes beneath), palette and a one-click drawing prompt. Turn the figure with the view controls, keyboard arrows or a horizontal touch swipe; click a trait to smoothly zoom to its location, and use “View full figure” to reset. Selecting a hidden trait returns to the front view. The prompt is assembled from the current identity traits, proportions, palette, principles and prohibited variations, with an expandable preview and clipboard feedback. The `#proportion` anchor points to the notes within Identity traits.
- **Wardrobe** (`/wardrobe?look=<id>`) — six sanctioned outfits, one canonical.
- **Art book** (`/gallery`) — finished illustrations with depth-map-driven pointer parallax inside stationary frames, plus a lightbox. Touch devices can enable calibrated tilt parallax; reduced-motion mode shows the original still images.
- **UI specification** (`/specs/ui`) — the live token catalog with contrast checks, type, space, radius, elevation, motion and components.
- **Sticker specification** (`/specs/stickers`) — canvas, rules, a server-side prompt composer and the full sticker set.
- **PV specification** (`/specs/pv`) — delivery format, identity and costume lock, rules, pipeline and stills from the Trick Heart cover.

Every page ends with a GitHub project call to action, plus links to `sticker.stv.pm`, `stv.pm`, and `@stv_lynn` on X.

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
