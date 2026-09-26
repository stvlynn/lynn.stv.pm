import type { Sticker, StickerSpec } from 'entities/sticker';
import { PromptComposer } from 'features/compose-sticker-prompt';
import { StickerSet } from 'features/browse-stickers';
import { motion, useReducedMotion } from 'motion/react';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import { Icon, Reveal, RuleList, Section } from 'shared/ui';
import styles from './StickerGuide.module.css';

const PAD = 70;

/** The canvas as a dimensioned drawing with a real sticker inside the safe area. */
function CanvasDiagram({ spec, sample }: { readonly spec: StickerSpec; readonly sample: Sticker | undefined }) {
  const reduced = useReducedMotion();
  const { width, height, safeArea } = spec.canvas;
  const draw = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true },
          transition: { duration: duration.slow * 2, ease: ease.emphasized, delay },
        };
  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
      className={styles.diagram}
      role="img"
      aria-label={`${width} × ${height} ${spec.canvas.format}`}
    >
      <rect
        className={styles.field}
        x={0}
        y={0}
        width={width}
        height={height}
        rx={6}
        fill={spec.canvas.background.hex}
      />
      {sample ? (
        <motion.image
          href={sample.image.src}
          x={safeArea}
          y={safeArea}
          width={width - safeArea * 2}
          height={height - safeArea * 2}
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: duration.slow, ease: ease.overshoot, delay: 0.5 }}
          style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
        />
      ) : null}
      <motion.rect
        className={styles.safe}
        x={safeArea}
        y={safeArea}
        width={width - safeArea * 2}
        height={height - safeArea * 2}
        {...draw(0.2)}
      />
      <motion.path
        className={styles.dim}
        d={`M 0 ${-34} L ${width} ${-34} M 0 -44 L 0 -24 M ${width} -44 L ${width} -24`}
        {...draw(0)}
      />
      <text className={styles.dimText} x={width / 2} y={-44} textAnchor="middle">
        {width} px
      </text>
      <motion.path
        className={styles.dim}
        d={`M ${-34} 0 L ${-34} ${height} M -44 0 L -24 0 M -44 ${height} L -24 ${height}`}
        {...draw(0.1)}
      />
      <text
        className={styles.dimText}
        x={-44}
        y={height / 2}
        textAnchor="middle"
        transform={`rotate(-90 -44 ${height / 2})`}
      >
        {height} px
      </text>
      <motion.path
        className={styles.dim}
        d={`M ${width - safeArea} ${height - safeArea} L ${width + 20} ${height + 40} L ${width + 60} ${height + 40}`}
        {...draw(0.3)}
      />
      <text className={styles.dimText} x={width + 20} y={height + 60}>
        {t('sticker.safeArea')} {safeArea}
      </text>
    </svg>
  );
}

export function StickerGuide({ spec }: { readonly spec: StickerSpec }) {
  const sample = spec.stickers.find((sticker) => sticker.kind === 'caption');
  return (
    <>
      <Section id="canvas" title={t('sticker.canvas')} code="SPC-05.1">
        <div className={styles.canvasLayout}>
          <Reveal>
            <CanvasDiagram spec={spec} sample={sample} />
          </Reveal>
          <Reveal index={1}>
            <p className={styles.summary}>{spec.summary}</p>
            <dl className={styles.specs}>
              <div className={styles.row}>
                <dt>{t('sticker.canvas')}</dt>
                <dd>
                  {spec.canvas.width} × {spec.canvas.height} · {spec.canvas.format}
                </dd>
              </div>
              <div className={styles.row}>
                <dt>{t('sticker.field')}</dt>
                <dd>
                  <span className={styles.chip} style={{ background: spec.canvas.background.hex }} />
                  {spec.canvas.background.label}
                </dd>
              </div>
              <div className={styles.row}>
                <dt>{t('sticker.outline')}</dt>
                <dd>{spec.canvas.outline}</dd>
              </div>
              <div className={styles.row}>
                <dt>{t('sticker.safeArea')}</dt>
                <dd>{spec.canvas.safeArea} px</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </Section>
      <Section id="rules" title={t('sticker.rules')} code="SPC-05.2">
        <RuleList rules={spec.rules} />
      </Section>
      <Section id="composer" title={t('sticker.composer')} code="SPC-05.3">
        <PromptComposer
          template={spec.promptTemplate}
          example={spec.promptExampleInput}
          maxCaptionLength={spec.maxCaptionLength}
        />
      </Section>
      <Section id="set" title={t('sticker.set')} code="SPC-05.4">
        <StickerSet stickers={spec.stickers} />
      </Section>
      <Section id="license" title={t('sticker.license')} code="SPC-05.5">
        <p className={styles.license}>{spec.license}</p>
        <div className={styles.channels}>
          {spec.channels.map((channel) => (
            <a key={channel.name} href={channel.url} target="_blank" rel="noreferrer">
              {channel.name} <Icon name="arrowUpRight" size={12} />
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
