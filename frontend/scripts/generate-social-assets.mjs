import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Glasses } from 'lucide-react';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const icon = renderToStaticMarkup(createElement(Glasses, { size: 24, strokeWidth: 2, color: '#f8fafd' }));
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#222d42"/><g transform="translate(4 4)">${icon}</g></svg>`;
await writeFile(`${publicDir}/favicon.svg`, favicon);
await mkdir(`${publicDir}/media/social`, { recursive: true });

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const figure = await readFile(`${publicDir}/media/reference/original-sheet.webp`);
  const serif = await readFile(fileURLToPath(new URL('../node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', import.meta.url)));
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Instrument; src: url(data:font/woff2;base64,${serif.toString('base64')}); }
    * { box-sizing: border-box; } body { margin: 0; width: 1200px; height: 630px; background: #fff; color: #222d42; }
    main { position: relative; width: 100%; height: 100%; padding: 70px 80px; overflow: hidden;
       }
    main:after { content: ''; position: absolute; inset: 24px; border: 1px solid #222d4226; pointer-events: none; }
    .eyebrow, footer { font: 16px monospace; letter-spacing: 2px; }
    .eyebrow { margin: 0 0 34px; color: #2e5fa8; } h1 { font: 150px/1 Instrument; margin: 0 0 8px; font-weight: 400; }
    h2 { font: 42px/1.15 Instrument; margin: 0; font-weight: 400; }
    .description { font: 20px/1.6 Georgia; width: 430px; margin-top: 30px; color: #536078; }
    img { position: absolute; right: 25px; top: 35px; width: 500px; height: 760px; object-fit: contain; }
    footer { position: absolute; bottom: 60px; font-size: 14px; letter-spacing: 1px; }
  </style></head><body><main><p class="eyebrow">LYN–STD / CHARACTER REFERENCE</p><h1>Lynn</h1><h2>Character Standard</h2><p class="description">Identity, wardrobe, art &amp; design.<br>A reference for creating with Lynn.</p><img src="data:image/webp;base64,${figure.toString('base64')}" alt="Lynn in her sailor uniform"><footer>lynn.stv.pm</footer></main></body></html>`);
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())); });
  await page.screenshot({ path: `${publicDir}/media/social/lynn-standard.png` });
  await page.setViewportSize({ width: 180, height: 180 });
  await page.setContent(`<style>body{margin:0}svg{width:180px;height:180px}</style>${favicon}`);
  await page.screenshot({ path: `${publicDir}/apple-touch-icon.png`, omitBackground: true });
} finally {
  await browser.close();
}
