import type { MediaDto, RuleDto, SwatchDto } from '@lynn/contracts';
import type { MediaAsset, Rule, Swatch } from '../../domain/shared';

export const toMediaDto = (media: MediaAsset): MediaDto => ({
  src: media.src,
  width: media.width,
  height: media.height,
  alt: media.alt,
});

export const toSwatchDto = (swatch: Swatch): SwatchDto => ({
  label: swatch.label,
  hex: swatch.color.value,
  token: swatch.token,
});

export const toRuleDto = (rule: Rule): RuleDto => ({
  id: rule.id,
  title: rule.title,
  body: rule.body,
  verdict: rule.verdict,
});
