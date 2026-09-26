import { buildTokenCss } from '@lynn/tokens';

const STYLE_ID = 'lynn-tokens';

/** Writes the design tokens as CSS custom properties before the first render. */
export function injectTokens(): void {
  const existing = document.getElementById(STYLE_ID);
  const style = existing ?? document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = buildTokenCss();
  if (!existing) {
    document.head.prepend(style);
  }
}
