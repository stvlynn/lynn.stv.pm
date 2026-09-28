"""Generate pen centerlines from the final filled SVG, without changing its artwork.

Requires Pillow, numpy, scipy, scikit-image, and the workspace Playwright with Chrome.
Run after vectorize.py: python3 frontend/scripts/lineart/trace-strokes.py
"""
import base64
import io
import json
import math
import re
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import distance_transform_edt
from skimage.measure import approximate_polygon
from skimage.morphology import skeletonize

ROOT = Path(__file__).resolve().parents[2] / 'src/shared/ui/blueprint'
source = (ROOT / 'lineart.ts').read_text()
height = float(re.search(r'LINEART_HEIGHT = ([\d.]+)', source)[1])
paths = re.findall(r'^  (".*")', source, re.M)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="800" height="{height * 2}" viewBox="0 0 400 {height}">' + ''.join(
    f'<path d="{json.loads(p)}"/>' for p in paths
) + '</svg>'
raster = subprocess.run(['node', '--input-type=module', '-e', """
import { chromium } from '@playwright/test';
let svg = '';
for await (const chunk of process.stdin) svg += chunk;
const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 800, height: 3200 } });
  await page.setContent('<style>body{margin:0}</style>' + svg);
  const ink = await page.locator('svg').screenshot({ omitBackground: true });
  await page.locator('path').evaluateAll(paths => paths.forEach(path => {
    const d = path.getAttribute('d');
    path.setAttribute('d', d.slice(0, d.indexOf('Z') + 1));
  }));
  const silhouette = await page.locator('svg').screenshot({ omitBackground: true });
  process.stdout.write(JSON.stringify({ ink: ink.toString('base64'), silhouette: silhouette.toString('base64') }));
} finally { await browser.close(); }
"""], input=svg.encode(), capture_output=True, check=True)
rasters = json.loads(raster.stdout)
def alpha(name):
    return np.array(Image.open(io.BytesIO(base64.b64decode(rasters[name]))).convert('RGBA'))[:, :, 3] > 32

ink = alpha('ink')
silhouette = alpha('silhouette')
# Open hair/neck contours can leave facial islands exposed to the background.
# A row envelope establishes the whole figure's outside boundary; enclosed
# edges (including the gap between the legs) belong to the structure phase.
for row in silhouette:
    occupied = np.flatnonzero(row)
    if occupied.size:
        row[occupied[0]:occupied[-1] + 1] = True
interior_distance = distance_transform_edt(silhouette)
order = json.loads((Path(__file__).parent / 'drawing-order.json').read_text())
details = Image.new('1', (ink.shape[1], ink.shape[0]))
regions = ImageDraw.Draw(details)
for region in order['detailRegions']:
    regions.polygon([(x * 2, y * 2) for x, y in region['polygon']], fill=1)
details = np.array(details)
skeleton = skeletonize(ink)
radius = distance_transform_edt(ink)
pixels = set(map(tuple, np.argwhere(skeleton)))


def neighbors(p):
    y, x = p
    return sorted((y + dy, x + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1)
                  if (dy or dx) and (y + dy, x + dx) in pixels
                  # Avoid triangle shortcuts around orthogonal corners.
                  and not (dy and dx and ((y + dy, x) in pixels or (y, x + dx) in pixels)))


def phase(p):
    # Separate the silhouette from enclosed construction lines before tracing:
    # a connected raster junction must never join different drawing stages.
    if interior_distance[p] <= radius[p] + 2:
        return 'contour'
    return 'details' if details[p] else 'structure'


graph = {p: {q for q in neighbors(p) if phase(p) == phase(q)} for p in sorted(pixels)}
traces = []
while any(graph.values()):
    endpoints = [p for p, edges in graph.items() if len(edges) == 1]
    start = min(endpoints or [p for p, edges in graph.items() if edges])
    points = [start]
    current = start
    while graph[current]:
        candidates = sorted(graph[current])
        if len(points) > 1:
            previous = points[max(0, len(points) - 6)]
            direction = np.subtract(current, previous)
            # Continue through junctions along the straightest pen direction.
            following = max(candidates, key=lambda p: np.dot(np.subtract(p, current), direction) / math.dist(p, current))
        else:
            following = candidates[0]
        graph[current].remove(following)
        graph[following].remove(current)
        points.append(following)
        current = following
    if len(points) > 1:
        traces.append(points)

# Lift the pen between strokes and between drawing stages. Proximity only
# determines travel within a stage; it never outranks the art direction.
ordered = []
for stage in order['phases']:
    pending = [points for points in traces if phase(points[0]) == stage]
    position = min((points[0] for points in pending), default=(0, 0))
    while pending:
        index, reverse = min(((i, reverse) for i in range(len(pending)) for reverse in (False, True)),
                             key=lambda item: math.dist(position, pending[item[0]][-1 if item[1] else 0]))
        points = pending.pop(index)
        if reverse:
            points.reverse()
        ordered.append(points)
        position = points[-1]

strokes = []
for points in ordered:
    length = sum(math.dist(a, b) for a, b in zip(points, points[1:])) / 2
    simplified = approximate_polygon(np.array(points), tolerance=0.7)
    d = 'M' + 'L'.join(f'{x / 2:g} {y / 2:g}' for y, x in simplified)
    # Cover antialiasing and the full width of the original ink at this stroke.
    width = max(radius[y, x] for y, x in points) + 2
    strokes.append({'phase': phase(points[0]), 'd': d, 'width': round(width, 2), 'length': round(length, 2)})

output = ROOT / 'generated/front-strokes.ts'
output.write_text('// Generated by frontend/scripts/lineart/trace-strokes.py. Do not edit by hand.\n'
                  'export const FRONT_STROKES = ' + json.dumps(strokes, separators=(',', ':')) + ' as const;\n')
print(f'Wrote {len(strokes)} pen strokes to {output}')
