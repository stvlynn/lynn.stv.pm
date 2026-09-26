# Art book depth

`features/browse-gallery` renders the original artwork through a WebGL depth-displacement shader. The frame, corners and label remain stationary. Pointer coordinates drive the existing `pointerSpring` preset; near surfaces move more than distant surfaces, and leaving the image returns to the original framing. A small movement-dependent overscan covers the image edges.

The effect runs only for visible artwork with no reduced-motion preference. Desktop uses a fine, hover-capable pointer; touch devices use calibrated device orientation after enabling tilt in the mobile header. See [mobile feedback](mobile-feedback.md) for permission and lifecycle behavior. The original semantic image remains underneath the decorative canvas, including during texture loading or WebGL unavailability. Initialization failures are logged; context restoration recreates GPU resources. The lightbox displays the original still image.

## Assets

Each artwork has a matching `/media/artworks/<artwork-id>-depth.webp` in `frontend/public`. White represents near surfaces and black represents distant surfaces. Adding or replacing an artwork requires adding or regenerating its aligned depth map. These maps are approximate depth estimates, not reconstructed geometry; keep displacement small to limit stretching at occlusion boundaries.

The four initial maps were generated from their corresponding original WebP images with the built-in `imagegen` tool. Originals remain unchanged. Maps were resized to 512 pixels wide at the source aspect ratio and encoded as grayscale WebP at quality 90.

Generation prompt used for each original:

> Create a technical grayscale DEPTH MAP of this exact image for WebGL parallax displacement. Preserve exact composition, aspect ratio and every object silhouette pixel-aligned with input. White means nearest to camera, black means farthest. Subject and immediate foreground light gray, intermediate architecture/people medium gray, distant skyline dark gray, sky nearly black. Smooth depth within surfaces, crisp accurate object boundaries with slight feathering. Ignore original colors, shadows and textures: encode ONLY distance from camera. No text, border, legends, no new objects. Output one map.

## Verification

Check all four images at opposite pointer positions: internal scene movement, stationary frame and label, no exposed edges, and smooth return on pointer exit. Verify lightbox opening and keyboard dismissal, mobile tilt in portrait and landscape, mobile scrolling, reduced-motion still images, both themes, and GPU cleanup when leaving the route.
