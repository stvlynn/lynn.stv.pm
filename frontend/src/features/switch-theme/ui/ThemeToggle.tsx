import { ThemeToggle as BeuiThemeToggle } from '@/components/motion/theme-toggle';
import { useTheme } from 'next-themes';
import { t } from 'shared/i18n';

/**
 * Whiteprint ⇄ blueprint. beUI repaints the page through a View Transition
 * with the "blinds" shutter, like a sheet sliding under the drafting lamp.
 */
export function ThemeToggle() {
  const { resolvedTheme } = useTheme();
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-(--color-text-muted)">
      <BeuiThemeToggle
        variant="blinds"
        className="h-8 w-8 rounded-full text-(--color-text) transition-colors hover:bg-muted"
        iconClassName="h-4 w-4"
      />
      <span aria-hidden="true">{resolvedTheme === 'dark' ? t('theme.dark') : t('theme.light')}</span>
    </span>
  );
}
