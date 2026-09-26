/**
 * Base color ramps. Every other color token aliases one of these values.
 *
 * `ink` and `corn` come from the Navy Ink design system (a cool blue-grey
 * spine and one cornflower accent). `character` is sampled from Lynn's
 * reference sheet; `scene` is sampled from the dusk artworks and the
 * Trick Heart PV.
 */

export interface RampStep {
  readonly step: string;
  readonly oklch: string;
  readonly hex: string;
}

export interface Ramp {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly steps: readonly RampStep[];
}

export const inkRamp: Ramp = {
  id: 'ink',
  name: 'Ink',
  description: 'Cool blue-grey spine, from silver-white paper to navy ink.',
  steps: [
    { step: '50', oklch: 'oklch(0.985 0.004 258)', hex: '#f8fafd' },
    { step: '100', oklch: 'oklch(0.969 0.006 258)', hex: '#f2f5f9' },
    { step: '150', oklch: 'oklch(0.947 0.010 258)', hex: '#e9eef4' },
    { step: '200', oklch: 'oklch(0.916 0.013 259)', hex: '#dee4ec' },
    { step: '300', oklch: 'oklch(0.858 0.017 259)', hex: '#cad1dc' },
    { step: '400', oklch: 'oklch(0.708 0.024 260)', hex: '#98a1b0' },
    { step: '500', oklch: 'oklch(0.585 0.028 261)', hex: '#737c8d' },
    { step: '600', oklch: 'oklch(0.480 0.032 262)', hex: '#545e70' },
    { step: '700', oklch: 'oklch(0.382 0.036 263)', hex: '#394356' },
    { step: '800', oklch: 'oklch(0.296 0.042 264)', hex: '#222d42' },
    { step: '900', oklch: 'oklch(0.232 0.044 265)', hex: '#131d32' },
    { step: '950', oklch: 'oklch(0.172 0.040 265)', hex: '#070f21' },
  ],
};

export const cornRamp: Ramp = {
  id: 'corn',
  name: 'Cornflower',
  description: 'The ribbon blue. One accent, reserved for focus, links and a single hero action.',
  steps: [
    { step: '50', oklch: 'oklch(0.966 0.018 257)', hex: '#ecf5ff' },
    { step: '100', oklch: 'oklch(0.930 0.036 257)', hex: '#d9e9ff' },
    { step: '200', oklch: 'oklch(0.878 0.062 258)', hex: '#bed9ff' },
    { step: '300', oklch: 'oklch(0.798 0.094 258)', hex: '#97bffa' },
    { step: '400', oklch: 'oklch(0.690 0.128 258)', hex: '#689cea' },
    { step: '500', oklch: 'oklch(0.585 0.152 259)', hex: '#3f7ad4' },
    { step: '600', oklch: 'oklch(0.520 0.156 260)', hex: '#2d65c1' },
    { step: '700', oklch: 'oklch(0.462 0.142 261)', hex: '#2654a6' },
    { step: '800', oklch: 'oklch(0.402 0.116 262)', hex: '#234586' },
  ],
};

export const characterRamp: Ramp = {
  id: 'lynn',
  name: 'Lynn',
  description: 'Sampled from the reference sheet. Use for illustration, never for interface chrome.',
  steps: [
    { step: 'hair', oklch: 'oklch(0.955 0.007 269)', hex: '#eef0f5' },
    { step: 'hair-shade', oklch: 'oklch(0.851 0.019 269)', hex: '#c9cedb' },
    { step: 'tip', oklch: 'oklch(0.738 0.104 228)', hex: '#5bb7de' },
    { step: 'iris', oklch: 'oklch(0.685 0.118 239)', hex: '#4aa3db' },
    { step: 'bow', oklch: 'oklch(0.743 0.092 226)', hex: '#67b8d8' },
    { step: 'ribbon', oklch: 'oklch(0.490 0.129 258)', hex: '#2e5fa8' },
    { step: 'beret', oklch: 'oklch(0.290 0.011 278)', hex: '#2a2b31' },
    { step: 'skirt', oklch: 'oklch(0.356 0.057 266)', hex: '#2e3b5a' },
    { step: 'glasses', oklch: 'oklch(0.738 0.091 80)', hex: '#c8a466' },
    { step: 'skin', oklch: 'oklch(0.953 0.025 60)', hex: '#fdecdf' },
    { step: 'name-bar', oklch: 'oklch(0.524 0.098 251)', hex: '#3c6da1' },
    { step: 'loafer', oklch: 'oklch(0.308 0.011 286)', hex: '#2f2f35' },
  ],
};

export const sceneRamp: Ramp = {
  id: 'scene',
  name: 'Scene',
  description: 'Dusk tones from the artworks and the stage red of the Trick Heart PV.',
  steps: [
    { step: 'night', oklch: 'oklch(0.324 0.051 273)', hex: '#2b324e' },
    { step: 'twilight', oklch: 'oklch(0.437 0.061 280)', hex: '#4b4e73' },
    { step: 'lavender', oklch: 'oklch(0.592 0.074 288)', hex: '#7b77a8' },
    { step: 'mauve', oklch: 'oklch(0.711 0.053 318)', hex: '#b098b8' },
    { step: 'dusk', oklch: 'oklch(0.828 0.046 27)', hex: '#e3bcb7' },
    { step: 'rain', oklch: 'oklch(0.851 0.017 282)', hex: '#cccdd9' },
    { step: 'stage', oklch: 'oklch(0.407 0.110 17)', hex: '#7a2b33' },
    { step: 'lyric', oklch: 'oklch(0.894 0.074 85)', hex: '#f3d9a4' },
  ],
};

export const signalRamp: Ramp = {
  id: 'signal',
  name: 'Signal',
  description: 'Validation states only. Used as a thin line or a tint, never as a fill.',
  steps: [
    { step: 'danger', oklch: 'oklch(0.560 0.190 22)', hex: '#c9343c' },
    { step: 'danger-soft', oklch: 'oklch(0.720 0.140 22)', hex: '#f0767a' },
    { step: 'success', oklch: 'oklch(0.560 0.120 162)', hex: '#1f8a66' },
    { step: 'success-soft', oklch: 'oklch(0.740 0.120 162)', hex: '#5cc59c' },
  ],
};

export const ramps: readonly Ramp[] = [inkRamp, cornRamp, characterRamp, sceneRamp, signalRamp];

export function rampValue(rampId: string, step: string): RampStep {
  const ramp = ramps.find((candidate) => candidate.id === rampId);
  const found = ramp?.steps.find((candidate) => candidate.step === step);
  if (!found) {
    throw new Error(`Unknown ramp step: ${rampId}-${step}`);
  }
  return found;
}
