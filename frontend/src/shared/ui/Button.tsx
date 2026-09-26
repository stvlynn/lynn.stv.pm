import { Button as BeuiButton, ButtonLink as BeuiButtonLink } from '@/components/motion/button';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { useHref, useLinkClickHandler } from 'react-router';
import { cn } from '../lib';

type Variant = 'ink' | 'accent' | 'outline' | 'ghost';
type Size = 'regular' | 'small';

interface StyleProps {
  readonly variant?: Variant;
  readonly size?: Size;
  readonly iconOnly?: boolean;
  readonly className?: string;
}

/** Lynn's accent is cornflower; beUI's primary is the ink action. */
const ACCENT = 'bg-(--color-accent) text-(--color-accent-contrast) hover:bg-(--color-accent)/90';
const MONO = 'font-mono tracking-[0.02em]';

const toBeui = ({ variant = 'outline', size = 'regular', iconOnly = false, className }: StyleProps) => ({
  variant: variant === 'ink' || variant === 'accent' ? ('primary' as const) : variant,
  size: iconOnly ? ('icon' as const) : size === 'small' ? ('sm' as const) : ('md' as const),
  className: cn(MONO, variant === 'accent' && ACCENT, iconOnly && size === 'regular' && 'h-10 w-10', className),
});

type ButtonProps = StyleProps & Omit<ComponentProps<typeof BeuiButton>, 'variant' | 'size' | 'className'>;

/** beUI spring-press button in Lynn's variants. */
export function Button({ variant, size, iconOnly, className, ...rest }: ButtonProps) {
  return <BeuiButton {...toBeui({ variant, size, iconOnly, className })} {...rest} />;
}

interface ButtonLinkProps extends StyleProps {
  readonly to: string;
  readonly children: ReactNode;
}

/** beUI button link that navigates inside the SPA. */
export function ButtonLink({ to, variant, size, iconOnly, className, children }: ButtonLinkProps) {
  const href = useHref(to);
  const onClick = useLinkClickHandler<HTMLAnchorElement>(to);
  return (
    <BeuiButtonLink
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => onClick(event)}
      {...toBeui({ variant, size, iconOnly, className })}
    >
      {children}
    </BeuiButtonLink>
  );
}
