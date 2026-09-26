import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Dot,
  Menu,
  Monitor,
  Moon,
  Play,
  Search,
  Sun,
  X,
  type LucideProps,
} from 'lucide-react';

const icons = {
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  copy: Copy,
  check: Check,
  close: X,
  sun: Sun,
  moon: Moon,
  monitor: Monitor,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  play: Play,
  menu: Menu,
  search: Search,
  cross: X,
  dot: Dot,
} as const;

export type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, 'ref'> {
  readonly name: IconName;
  readonly size?: number;
}

/** Lucide stroke icons (the icon set beUI ships with), by semantic name. */
export function Icon({ name, size = 16, ...rest }: IconProps) {
  const Component = icons[name];
  return <Component size={size} strokeWidth={1.75} aria-hidden="true" focusable="false" {...rest} />;
}
