const RANGE = 20;
const DEAD_ZONE = 0.025;
const normalized = (angle: number) => {
  const value = Math.max(-1, Math.min(1, angle / RANGE));
  return Math.abs(value) < DEAD_ZONE ? 0 : value;
};
const shortestAngle = (angle: number) => ((angle + 540) % 360) - 180;

/** Map relative device angles into screen coordinates, including landscape rotation. */
export function normalizeTilt(beta: number, gamma: number, screenAngle: number) {
  const angle = (screenAngle * Math.PI) / 180;
  const vertical = shortestAngle(beta);
  const horizontal = shortestAngle(gamma);
  return {
    x: normalized(horizontal * Math.cos(angle) + vertical * Math.sin(angle)),
    y: normalized(vertical * Math.cos(angle) - horizontal * Math.sin(angle)),
  };
}
