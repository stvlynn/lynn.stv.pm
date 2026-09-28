# 0004 — Line-art figure pipeline

## Status

Accepted

## Context

The home page opens on a front-elevation line drawing of Lynn, annotated like an engineering drawing. A hand-authored SVG did not hold the character's likeness. The drawing must stay vector so strokes can use theme tokens and be revealed with motion.

## Decision

- An image model redraws the signature outfit as clean black line art on white (`frontend/scripts/lineart/source.png`).
- `frontend/scripts/lineart/vectorize.py` traces it with potrace (2× upscale, `opttolerance 0.6`, compound paths kept so holes stay open), normalizes it to 400 units wide and writes `frontend/src/shared/ui/blueprint/lineart.ts`.
- The source omitted the glasses, so `figure.ts` adds them as stroked paths over the trace.
- `figure.ts` owns the drawing's geometry (head top, chin, centerline, hem) and the anchor point for each trait id. Callout labels come from the API traits; `layout.ts` spaces them into two columns.
- `trace-strokes.py` skeletonizes the rendered vector ink into centerline pen paths, split into silhouette, structure and detail phases. Exterior contours identify the silhouette; authored regions in `drawing-order.json` identify facial features and accessories. `FigureDrawing` animates these paths inside a mask to uncover the original filled outlines, then reveals callouts. This replaces the previous top-to-bottom scan.

## Consequences

- Regenerating the drawing is: replace `source.png`, run both vectorization and centerline tracing scripts, re-check anchors in `figure.ts`.
- `lineart.ts` is generated and excluded from formatting.
- Character turnaround views extend the same pipeline: source images live in `frontend/scripts/lineart/views/`, generated paths in `blueprint/generated/`, and view-specific anchors in `blueprint/views.ts`. The vectorizer accepts source/output paths, an optional common height, an ink threshold and a standalone SVG destination. Sources with alpha are composited onto white before tracing.
- Proportion content (6.6 heads) is kept consistent with the measured drawing.

## Alternatives considered

- **Hand-written SVG.** Rejected after review: poor likeness.
- **Raster image with CSS effects.** Rejected: no themed strokes, no mask reveal.
- **Stroke-dash drawing of filled outline edges.** Rejected: potrace outputs filled outlines, so dash animation draws their edges twice. Stroke-dash animation is instead applied to separate skeleton centerlines inside a reveal mask.

## References

- [`frontend/design-system.md`](../frontend/design-system.md)
