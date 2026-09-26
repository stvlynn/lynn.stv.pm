import { useMotionTemplate, useSpring } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { pointerSpring } from '../../lib';

interface FigureCameraProps {
  readonly target: { readonly x: number; readonly y: number; readonly scale: number };
  readonly reduced: boolean;
  readonly children: ReactNode;
}

/** SVG coordinates must scale about the drawing origin, not a changing content bounding box. */
export function FigureCamera({ target, reduced, children }: FigureCameraProps) {
  const group = useRef<SVGGElement>(null);
  const x = useSpring(0, pointerSpring);
  const y = useSpring(0, pointerSpring);
  const scale = useSpring(1, pointerSpring);
  const transform = useMotionTemplate`translate(${x} ${y}) scale(${scale})`;

  useEffect(() => {
    const update = (value: string) => group.current?.setAttribute('transform', value);
    update(transform.get());
    return transform.on('change', update);
  }, [transform]);

  useEffect(() => {
    if (reduced) {
      x.jump(target.x);
      y.jump(target.y);
      scale.jump(target.scale);
    } else {
      x.set(target.x);
      y.set(target.y);
      scale.set(target.scale);
    }
  }, [target.x, target.y, target.scale, reduced, x, y, scale]);

  return (
    <g ref={group} data-camera="true">
      {children}
    </g>
  );
}
