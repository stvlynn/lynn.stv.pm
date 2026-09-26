# Icons and social metadata

The favicon uses the Lucide `Glasses` glyph on an ink background. Interface icons use the existing shared Lucide adapter; character drawings and technical diagrams are content illustrations.

`frontend/src/shared/config/seo.ts` owns page titles, descriptions, the production origin and social image metadata. Vite's `frontend/seo-plugin.ts` writes these tags into the root HTML and emits a separate HTML entry for every route in `shared/config/routes.ts`. The production static server serves these directory entries before its SPA fallback, so crawlers receive metadata without JavaScript. AppShell updates the same tags during client navigation. Query parameters and fragments do not change the canonical page URL; wardrobe selections share the wardrobe page card.

All pages share `frontend/public/media/social/lynn-standard.png`, an opaque 1200 × 630 PNG card. OG and Twitter tags use its absolute HTTPS URL and include an image description. The card uses the original character reference artwork and Instrument Serif. The touch icon is 180 × 180 PNG.

To regenerate the committed favicon, touch icon and card, install the Playwright Chromium browser and run:

```sh
node frontend/scripts/generate-social-assets.mjs
```

To use an installed Chrome instead, set `PLAYWRIGHT_CHANNEL=chrome`. Asset generation is explicit; regular production builds use the committed files and do not need a browser. Lucide's license is included at `frontend/public/licenses/lucide.txt`.

After changing metadata, run `pnpm build` and inspect the HTML returned from the production server for each route, including `/specs/stickers`. Verify the card returns `image/png` and the declared dimensions match the file. A browser-only head inspection does not establish crawler support. Platform preview caches can require a refresh after deployment.
