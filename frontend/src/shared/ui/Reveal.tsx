import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { enterTransition } from '../lib';

interface RevealProps {
  readonly children: ReactNode;
  readonly index?: number;
  readonly as?: 'div' | 'section' | 'li' | 'header' | 'article';
  readonly className?: string;
}

/**
 * Split-and-stagger enter: fades, lifts 12px and un-blurs once, when the
 * block scrolls into view. Reduced motion shows the end state at once.
 */
export function Reveal({ children, index = 0, as = 'div', className }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  if (reduced) {
    return <Component className={className}>{children}</Component>;
  }
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={enterTransition(index)}
    >
      {children}
    </Component>
  );
}
