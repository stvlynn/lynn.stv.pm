/** Parses an m:ss or m:ss.ff timecode into seconds. */
export function timecodeToSeconds(timecode: string, fps: number): number {
  const match = /^(\d+):(\d{2})(?:\.(\d{2}))?$/.exec(timecode);
  if (!match) {
    throw new Error(`Invalid timecode: ${timecode}`);
  }
  const [, minutes, seconds, frames] = match;
  return Number(minutes) * 60 + Number(seconds) + (frames ? Number(frames) / fps : 0);
}
