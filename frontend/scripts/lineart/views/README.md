# Character turnaround sources

`left.png`, `back.png` and `right.png` were generated with the built-in `imagegen` tool from `../source.png` and the canonical `frontend/public/media/reference/original-sheet.webp`. These are derived illustrations of unseen angles, not additional artist-supplied reference sheets. The original front source is preserved.

Left and right name the direction the figure faces on the page. The viewer uses discrete views, not a continuous 3D model. Each view is independently drawn rather than mirrored; asymmetric accessories may be partially visible in the side drawings.

Sources contain transparency. The vectorizer composites onto white before tracing, uses an ink threshold of 210 for the lighter side-view strokes and 165 for the back to exclude gray shading, and centers every figure on the same 400-unit-wide canvas at the original height. Generated TypeScript paths drive the themed inline SVG; standalone SVGs are also saved under `frontend/public/media/character`.

From the repository root (requires potrace, Pillow and svgpathtools):

```sh
for view in left back right; do
  threshold=210
  if [ "$view" = back ]; then threshold=165; fi
  python3 frontend/scripts/lineart/vectorize.py \
    --source "frontend/scripts/lineart/views/$view.png" \
    --output "frontend/src/shared/ui/blueprint/generated/$view.ts" \
    --height 1508.5 --threshold "$threshold" \
    --svg-output "frontend/public/media/character/$view.svg"
done
```

After regenerating, inspect `shared/ui/blueprint/views.ts`: anchors must land on the corresponding trait in each drawing, hidden traits must be absent, and the hem measurement must match the visible silhouette. The height and head unit stay aligned with the original front figure for comparison.

## Generation prompts

### left

Use case: identity-preserve. Create ONE full-body character turnaround line drawing for a technical SVG reference viewer. Image 1 is the existing front line-art drawing: match its character proportions (6.6 heads), clean black outline style, quiet standing pose with hands behind back, outfit and overall silhouette. Image 2 is supporting canonical character reference: preserve round thin-wire glasses, bob haircut, beret with rear side ribbon, sailor blouse, above-knee pleated skirt, ankle socks and penny loafers. Strict side elevation, character's nose points LEFT on the page. Camera sees her left side. The ribbon at the opposite rear side of beret is largely hidden; do not relocate it. Glasses seen in profile with temple. Rotate the SAME person in the same standing pose; do not just horizontally mirror the front image. Pure black clean medium-weight contour lines on pure white background, no grey, no shading, no hatching, no solid black clothing fills. Interior details sparse and crisp, suitable for potrace vector tracing. Entire person head to shoe soles, centered with white padding, portrait image. No labels, no arrows, no measurements, no extra panels, no watermark, no scenery. Preserve exact outfit and anatomy; add no accessories.

### back

Use case: identity-preserve. Create ONE full-body character turnaround line drawing for a technical SVG reference viewer. Image 1 is the existing front line-art drawing: match its character proportions (6.6 heads), clean black outline style, quiet standing pose with hands behind back, outfit and overall silhouette. Image 2 is supporting canonical character reference: preserve round thin-wire glasses, bob haircut, beret with rear side ribbon, sailor blouse, above-knee pleated skirt, ankle socks and penny loafers. Strict rear elevation, face and eyes not visible. Show back of beret, chin-length bob, back sailor collar and pleated skirt. The ribbon is on the same physical side as the original reference; seen from behind it appears on the LEFT of the page. No chest bow, name bar or front clasps visible from behind. Rotate the SAME person in the same standing pose; do not just horizontally mirror the front image. Pure black clean medium-weight contour lines on pure white background, no grey, no shading, no hatching, no solid black clothing fills. Interior details sparse and crisp, suitable for potrace vector tracing. Entire person head to shoe soles, centered with white padding, portrait image. No labels, no arrows, no measurements, no extra panels, no watermark, no scenery. Preserve exact outfit and anatomy; add no accessories.

### right

Use case: identity-preserve. Create ONE full-body character turnaround line drawing for a technical SVG reference viewer. Image 1 is the existing front line-art drawing: match its character proportions (6.6 heads), clean black outline style, quiet standing pose with hands behind back, outfit and overall silhouette. Image 2 is supporting canonical character reference: preserve round thin-wire glasses, bob haircut, beret with rear side ribbon, sailor blouse, above-knee pleated skirt, ankle socks and penny loafers. Strict side elevation, character's nose points RIGHT on the page. Camera sees her right side. Preserve the ribbon at the rear of the beret and right bangs hair clip from reference. Glasses seen in profile with temple. Rotate the SAME person in the same standing pose; do not just horizontally mirror the front image. Pure black clean medium-weight contour lines on pure white background, no grey, no shading, no hatching, no solid black clothing fills. Interior details sparse and crisp, suitable for potrace vector tracing. Entire person head to shoe soles, centered with white padding, portrait image. No labels, no arrows, no measurements, no extra panels, no watermark, no scenery. Preserve exact outfit and anatomy; add no accessories.
