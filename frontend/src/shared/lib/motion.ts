import { durations, easings } from '@lynn/tokens';
import type { Transition } from 'motion/react';

type Bezier = [number, number, number, number];

const easing = (name: string): Bezier => {
  const token = easings.find((candidate) => candidate.name === name);
  if (!token) {
    throw new Error(`Unknown easing token: ${name}`);
  }
  return [...token.points];
};

const seconds = (name: string): number => {
  const token = durations.find((candidate) => candidate.name === name);
  if (!token) {
    throw new Error(`Unknown duration token: ${name}`);
  }
  return Number.parseFloat(token.value) / 1000;
};

/** Motion presets, derived from the design tokens so CSS and JS agree. */
export const ease = {
  out: easing('ease-out'),
  inOut: easing('ease-in-out'),
  emphasized: easing('ease-emphasized'),
  overshoot: easing('ease-overshoot'),
} as const;

export const duration = {
  instant: seconds('duration-instant'),
  quick: seconds('duration-quick'),
  base: seconds('duration-base'),
  slow: seconds('duration-slow'),
  drawn: seconds('duration-drawn'),
} as const;

export const STAGGER = 0.07;

export const enterTransition = (index = 0): Transition => ({
  duration: duration.slow,
  ease: ease.out,
  delay: index * STAGGER,
});

/** A soft spring for pointer-driven tilt and parallax. */
export const pointerSpring = { stiffness: 170, damping: 22, mass: 0.6 } as const;
