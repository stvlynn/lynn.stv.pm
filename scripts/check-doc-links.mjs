// Verifies that every relative Markdown link in the repository resolves.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SKIP = new Set(['node_modules', '.git', 'dist', '.claude', '.agents', '.workspace']);
const LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;

function* markdownFiles(directory) {
  for (const entry of readdirSync(directory)) {
    if (SKIP.has(entry)) continue;
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) yield* markdownFiles(path);
    else if (entry.endsWith('.md')) yield path;
  }
}

const broken = [];
for (const file of markdownFiles(ROOT)) {
  for (const [, target] of readFileSync(file, 'utf8').matchAll(LINK)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const path = resolve(dirname(file), decodeURI(target.split('#')[0]));
    if (!existsSync(path)) broken.push(`${file.slice(ROOT.length + 1)} → ${target}`);
  }
}

if (broken.length > 0) {
  console.error(`Broken links:\n${broken.join('\n')}`);
  process.exit(1);
}
console.log('All documentation links resolve.');
