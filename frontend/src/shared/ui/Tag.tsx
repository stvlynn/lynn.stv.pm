import { AnimatedBadge } from '@/components/motion/animated-badge';
import type { ReactNode } from 'react';

/** beUI badge: neutral by default, cornflower for the one accented label. */
export function Tag({
  children,
  tone = 'neutral',
}: {
  readonly children: ReactNode;
  readonly tone?: 'neutral' | 'accent';
}) {
  return (
    <AnimatedBadge
      status={tone === 'accent' ? 'info' : 'neutral'}
      size="sm"
      showIcon={false}
      className="font-mono uppercase tracking-[0.06em] text-(--color-text-muted) data-[tone=accent]:text-(--color-accent)"
      data-tone={tone}
    >
      {children}
    </AnimatedBadge>
  );
}
