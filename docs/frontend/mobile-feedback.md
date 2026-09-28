# Mobile feedback

On coarse-pointer devices, tilt starts automatically when the page opens. The app immediately tries to request orientation access. Browsers that require a user gesture defer the permission prompt until the first page click; there is no tilt switch. Hold the phone comfortably while the first valid reading calibrates the center. Twenty degrees of relative tilt reaches maximum displacement; a small dead zone suppresses jitter. Landscape rotation, returning from the background and resuming after Reduce Motion recalibrate the neutral pose.

The drawing-sheet figure and text, decorative coordinate readout, and visible art-book depth canvases consume the same normalized sensor values. Existing springs smooth the motion. Touch scrolling remains native and never drives parallax. Desktop hover behavior remains available when tilt is inactive.

The shared `DeviceFeedbackProvider`, installed in app providers, owns one sensor listener. Motion values avoid React renders for individual sensor readings. It removes the listener and returns surfaces to neutral when hidden, using a fine pointer, or respecting Reduce Motion. No valid reading within four seconds produces an unavailable state. Permission denial and insecure/unsupported contexts have explicit messages. Tilt requires HTTPS (localhost is suitable for automated tests).

**Touch feedback** in the navigation drawer controls vibration for the current app session. Feedback defaults on for supported coarse-pointer browsers, is rate-limited to one pattern per 90 ms, and stops when disabled, hidden, or Reduce Motion is active. It never runs continuously during tilting or scrolling.

| Action                                                 | Pattern                            |
| ------------------------------------------------------ | ---------------------------------- |
| Change character view, choose a navigation destination | Light: 8 ms                        |
| Inspect a trait, open artwork/navigation               | Medium: 20 ms                      |
| Successful clipboard copy                              | Success: 12 ms, 45 ms pause, 24 ms |

The Vibration API controls duration and rhythm, not motor amplitude. Hardware and browser settings determine physical strength; unsupported browsers (including iOS Safari) retain the existing visual feedback. No vibration is claimed when the API is absent. Preferences reset on page reload; permission remains governed by the browser.

## Verification

Unit tests cover calibration, angular wrapping, landscape axes, clamping, permission denial, missing readings, throttling and disabling haptics. Browser checks cover mobile routes in both themes, sensor events, reduced motion and horizontal overflow. On physical Android and iOS devices, check the actual permission prompt, tilt direction in both landscape orientations, native scrolling, and vibration feel on supported hardware. Browser emulation cannot verify motor strength or physical sensor quality.
