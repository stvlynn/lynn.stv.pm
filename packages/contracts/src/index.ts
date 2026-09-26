/**
 * Wire contracts between the backend `interfaces` layer and the frontend
 * `features/*\/api` segments. Types only: no runtime code lives here except
 * route constants.
 */

export const API_PREFIX = '/api/v1';

export const apiRoutes = {
  character: '/character',
  outfits: '/outfits',
  outfit: (id: string) => `/outfits/${encodeURIComponent(id)}`,
  artworks: '/artworks',
  artwork: (id: string) => `/artworks/${encodeURIComponent(id)}`,
  uiSpec: '/specs/ui',
  stickerSpec: '/specs/sticker',
  stickerPrompt: '/specs/sticker/prompts',
  pvSpec: '/specs/pv',
} as const;

// ——— Envelope ————————————————————————————————————————————————

export interface ApiError {
  readonly code: string;
  readonly message: string;
}

export type ApiEnvelope<T> =
  | { readonly success: true; readonly data: T; readonly error: null }
  | { readonly success: false; readonly data: null; readonly error: ApiError };

// ——— Shared ——————————————————————————————————————————————————

export interface MediaDto {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export interface SwatchDto {
  readonly label: string;
  readonly hex: string;
  readonly token: string | null;
}

// ——— Character ———————————————————————————————————————————————

export interface CreditDto {
  readonly role: string;
  readonly name: string;
  readonly url: string | null;
}

export interface TraitDto {
  /** Stable id; the drawing sheet anchors callouts to it. */
  readonly id: string;
  readonly part: string;
  readonly label: string;
  readonly detail: string;
  readonly swatch: SwatchDto | null;
}

export interface PillarDto {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface FactDto {
  readonly label: string;
  readonly value: string;
}

export interface ProportionDto {
  readonly headsTall: number;
  readonly note: string;
}

export interface CharacterProfileDto {
  readonly name: string;
  readonly nameNative: string;
  readonly tagline: string;
  readonly summary: string;
  readonly credits: readonly CreditDto[];
  readonly facts: readonly FactDto[];
  readonly pillars: readonly PillarDto[];
  readonly traits: readonly TraitDto[];
  readonly palette: readonly SwatchDto[];
  readonly proportion: ProportionDto;
  readonly referenceSheet: MediaDto;
  readonly doNot: readonly string[];
}

// ——— Wardrobe ————————————————————————————————————————————————

export interface GarmentDto {
  readonly slot: string;
  readonly name: string;
}

export interface OutfitDto {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly occasion: string;
  readonly summary: string;
  readonly canonical: boolean;
  readonly image: MediaDto;
  readonly garments: readonly GarmentDto[];
  readonly palette: readonly SwatchDto[];
  readonly source: string;
}

// ——— Gallery —————————————————————————————————————————————————

export interface ArtworkDto {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly caption: string;
  readonly mood: string;
  readonly image: MediaDto;
  readonly palette: readonly SwatchDto[];
  readonly motifs: readonly string[];
  readonly orientation: 'portrait' | 'landscape' | 'square';
}

// ——— UI specification ————————————————————————————————————————

export interface RampStepDto {
  readonly step: string;
  readonly cssVar: string;
  readonly oklch: string;
  readonly hex: string;
}

export interface RampDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly steps: readonly RampStepDto[];
}

export interface SemanticColorDto {
  readonly name: string;
  readonly cssVar: string;
  readonly description: string;
  readonly light: string;
  readonly dark: string;
  readonly lightHex: string;
  readonly darkHex: string;
}

export interface ContrastDto {
  readonly foreground: string;
  readonly background: string;
  readonly theme: 'light' | 'dark';
  readonly ratio: number;
  readonly grade: 'AAA' | 'AA' | 'AA Large' | 'Fail';
}

export interface FontFamilyDto {
  readonly name: string;
  readonly cssVar: string;
  readonly family: string;
  readonly stack: string;
  readonly description: string;
  readonly specimen: string;
}

export interface TypeStyleDto {
  readonly name: string;
  readonly cssVar: string;
  readonly family: string;
  readonly size: string;
  readonly leading: string;
  readonly tracking: string;
  readonly weight: number;
  readonly uppercase: boolean;
  readonly description: string;
}

export interface ScalarTokenDto {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
  readonly description: string;
}

export interface EasingTokenDto extends ScalarTokenDto {
  readonly points: readonly [number, number, number, number];
}

export interface UiPrincipleDto {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface UiSpecDto {
  readonly principles: readonly UiPrincipleDto[];
  readonly ramps: readonly RampDto[];
  readonly semantic: readonly SemanticColorDto[];
  readonly contrast: readonly ContrastDto[];
  readonly fonts: readonly FontFamilyDto[];
  readonly typeStyles: readonly TypeStyleDto[];
  readonly space: readonly ScalarTokenDto[];
  readonly radii: readonly ScalarTokenDto[];
  readonly shadows: readonly ScalarTokenDto[];
  readonly durations: readonly ScalarTokenDto[];
  readonly easings: readonly EasingTokenDto[];
  readonly motion: readonly ScalarTokenDto[];
}

// ——— Sticker specification ———————————————————————————————————

export interface StickerDto {
  readonly id: string;
  readonly title: string;
  readonly kind: 'caption' | 'expression';
  readonly image: MediaDto;
}

export interface RuleDto {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly verdict: 'do' | 'dont' | 'note';
}

export interface ChannelDto {
  readonly name: string;
  readonly url: string;
}

export interface StickerCanvasDto {
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly background: SwatchDto;
  readonly outline: string;
  readonly safeArea: number;
}

export interface StickerSpecDto {
  readonly summary: string;
  readonly canvas: StickerCanvasDto;
  readonly rules: readonly RuleDto[];
  readonly promptTemplate: string;
  readonly promptExample: string;
  readonly promptExampleInput: ComposeStickerPromptRequest;
  readonly maxCaptionLength: number;
  readonly license: string;
  readonly channels: readonly ChannelDto[];
  readonly stickers: readonly StickerDto[];
}

export interface ComposeStickerPromptRequest {
  readonly text: string;
  readonly action: string;
}

export interface ComposeStickerPromptResponse {
  readonly prompt: string;
}

// ——— PV specification ————————————————————————————————————————

export interface CostumeDto {
  readonly id: string;
  readonly role: string;
  readonly garments: readonly string[];
}

export interface PipelineStepDto {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface StillDto {
  readonly id: string;
  readonly timecode: string;
  readonly caption: string;
  readonly image: MediaDto;
}

export interface VideoFormatDto {
  readonly width: number;
  readonly height: number;
  readonly fps: number;
  readonly durationSeconds: number;
  readonly frames: number;
  readonly audio: string;
  readonly runtime: string;
}

export interface PvSpecDto {
  readonly title: string;
  readonly titleNative: string;
  readonly credit: string;
  readonly summary: string;
  readonly format: VideoFormatDto;
  readonly identityLock: readonly string[];
  readonly costumes: readonly CostumeDto[];
  readonly costumeSheet: MediaDto;
  readonly rules: readonly RuleDto[];
  readonly pipeline: readonly PipelineStepDto[];
  readonly stills: readonly StillDto[];
  readonly excerpt: { readonly src: string; readonly poster: string };
}
