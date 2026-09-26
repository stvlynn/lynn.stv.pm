/** Index of the neighbouring item, wrapping at both ends. */
export function wrapIndex(index: number, step: number, length: number): number {
  return (((index + step) % length) + length) % length;
}
