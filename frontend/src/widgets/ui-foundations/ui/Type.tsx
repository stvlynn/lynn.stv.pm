import type { FontFamilyDto, TypeStyleDto } from '@lynn/contracts';
import type { CSSProperties } from 'react';
import { t } from 'shared/i18n';
import { CopyValue, Reveal } from 'shared/ui';
import styles from './Foundations.module.css';

export function FontFamilies({ fonts }: { readonly fonts: readonly FontFamilyDto[] }) {
  return (
    <div className={styles.families}>
      {fonts.map((font, index) => (
        <Reveal key={font.name} index={index} className={styles.family}>
          <span className={styles.label}>
            <CopyValue value={`var(${font.cssVar})`}>{font.cssVar}</CopyValue>
          </span>
          <span className={styles.familyGlyph} style={{ fontFamily: `var(${font.cssVar})` }}>
            {t('ui.glyph')}
          </span>
          <p className={styles.familySpecimen} style={{ fontFamily: `var(${font.cssVar})` }}>
            {font.specimen}
          </p>
          <span>{font.family}</span>
          <span className={styles.muted}>{font.description}</span>
        </Reveal>
      ))}
    </div>
  );
}

export function TypeScale({
  styles: typeStyles,
  sample,
}: {
  readonly styles: readonly TypeStyleDto[];
  readonly sample: string;
}) {
  return (
    <div className={styles.scale}>
      {typeStyles.map((style, index) => {
        const css: CSSProperties = {
          fontFamily: `var(--font-${style.family})`,
          fontSize: `var(${style.cssVar}-size)`,
          lineHeight: `var(${style.cssVar}-leading)`,
          letterSpacing: `var(${style.cssVar}-tracking)`,
          fontWeight: style.weight,
          textTransform: style.uppercase ? 'uppercase' : 'none',
        };
        return (
          <Reveal key={style.name} index={index % 4} className={styles.scaleRow}>
            <div>
              <p className={styles.label}>{style.name}</p>
              <p className={`${styles.mono} ${styles.muted}`}>
                {style.family} · {style.leading} · {style.tracking}
              </p>
            </div>
            <p className={styles.scaleSample} style={css} title={style.description}>
              {sample}
            </p>
          </Reveal>
        );
      })}
    </div>
  );
}
