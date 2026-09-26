import type { Artwork } from 'entities/artwork';
import { useInView, useSpring } from 'motion/react';
import { useEffect, useRef, type PointerEvent } from 'react';
import { pointerSpring, useMediaQuery, useTiltTarget } from 'shared/lib';
import { createDepthRenderer } from '../lib/depth-renderer';
import styles from './ArtworkPlate.module.css';

export function ArtworkDepth({ artwork }: { readonly artwork: Artwork }) {
  const host = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const visible = useInView(host, { margin: '100px' });
  const pointerEnabled = useMediaQuery(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  const x = useSpring(0, pointerSpring);
  const y = useSpring(0, pointerSpring);
  const tilt = useTiltTarget(x, y, 1, true, visible);
  const enabled = pointerEnabled || tilt;

  useEffect(() => {
    const surface = canvas.current;
    const source = image.current;
    if (!enabled || !visible || !surface || !source) return;
    let cancelled = false;
    let frame = 0;
    let renderer: ReturnType<typeof createDepthRenderer> | undefined;
    const depth = new Image();
    depth.src = `/media/artworks/${artwork.id}-depth.webp`;
    const draw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => renderer?.draw(x.get(), y.get()));
    };
    const initialize = async () => {
      try {
        await Promise.all([source.decode(), depth.decode()]);
        if (cancelled) return;
        renderer?.dispose();
        renderer = createDepthRenderer(surface, source, depth);
        renderer.draw(x.get(), y.get());
        surface.dataset.ready = 'true';
      } catch (error) {
        if (!cancelled) console.error(`Unable to render artwork depth: ${artwork.id}`, error);
      }
    };
    const loseContext = (event: Event) => {
      event.preventDefault();
      delete surface.dataset.ready;
      renderer = undefined;
    };
    surface.addEventListener('webglcontextlost', loseContext);
    surface.addEventListener('webglcontextrestored', initialize);
    const stopX = x.on('change', draw);
    const stopY = y.on('change', draw);
    const resize = new ResizeObserver(draw);
    resize.observe(surface);
    void initialize();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stopX();
      stopY();
      resize.disconnect();
      renderer?.dispose();
      delete surface.dataset.ready;
      surface.removeEventListener('webglcontextlost', loseContext);
      surface.removeEventListener('webglcontextrestored', initialize);
      x.jump(0);
      y.jump(0);
    };
  }, [artwork.id, enabled, visible, x, y]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!pointerEnabled || tilt || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2)));
    y.set(Math.max(-1, Math.min(1, (0.5 - (event.clientY - rect.top) / rect.height) * 2)));
  };
  const reset = () => {
    if (tilt) return;
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={host} className={styles.painting} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <img
        ref={image}
        src={artwork.image.src}
        alt={artwork.image.alt}
        width={artwork.image.width}
        height={artwork.image.height}
        loading="lazy"
        decoding="async"
        className={styles.image}
      />
      {enabled && visible ? <canvas ref={canvas} className={styles.canvas} aria-hidden="true" /> : null}
    </div>
  );
}
