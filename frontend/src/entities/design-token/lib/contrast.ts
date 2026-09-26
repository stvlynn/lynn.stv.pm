/** Picks light or dark ink for text placed on a swatch, by perceived brightness. */
export function inkOn(hex: string): 'light' | 'dark' {
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? 'dark' : 'light';
}
