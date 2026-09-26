import type { ContrastDto, SemanticColorDto } from '@lynn/contracts';
import { inkOn, type Ramp } from 'entities/design-token';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { t } from 'shared/i18n';
import { duration, ease, useCopy } from 'shared/lib';
import { AnimatedNumber, CopyValue, Reveal, Tag } from 'shared/ui';
import styles from './Foundations.module.css';

const readableOn = (hex: string): string => (inkOn(hex) === 'dark' ? 'var(--ink-900)' : 'var(--ink-50)');

/** A ramp as one strip; the hovered step widens to show its values. Click copies the variable. */
function RampStrip({ ramp }: { readonly ramp: Ramp }) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const { copied, copy } = useCopy();
  return (
    <div className={styles.strip} onPointerLeave={() => setHovered(null)}>
      {ramp.steps.map((step) => {
        const open = hovered === step.step;
        return (
          <motion.button
            key={step.step}
            type="button"
            className={styles.step}
            style={{ background: step.hex, color: readableOn(step.hex) }}
            animate={{ flexGrow: open && !reduced ? 3.2 : 1 }}
            transition={{ duration: duration.base, ease: ease.out }}
            onPointerEnter={() => setHovered(step.step)}
            onFocus={() => setHovered(step.step)}
            onClick={() => void copy(`var(${step.cssVar})`)}
            aria-label={`${t('common.copy')} var(${step.cssVar})`}
          >
            <span className={styles.stepName}>{open && copied ? t('common.copied') : step.step}</span>
            {open ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.stepValue}>
                {step.hex} · {step.oklch}
              </motion.span>
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}

export function ColorRamps({ ramps }: { readonly ramps: readonly Ramp[] }) {
  return (
    <div className={styles.ramps}>
      {ramps.map((ramp, index) => (
        <Reveal key={ramp.id} index={index}>
          <div className={styles.rampHeader}>
            <h3 className={styles.rampName}>{ramp.name}</h3>
            <span className={`${styles.mono} ${styles.muted}`}>--{ramp.id}-*</span>
            <span className={styles.muted}>{ramp.description}</span>
          </div>
          <RampStrip ramp={ramp} />
        </Reveal>
      ))}
    </div>
  );
}

export function SemanticTable({ tokens }: { readonly tokens: readonly SemanticColorDto[] }) {
  return (
    <Reveal className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t('ui.token')}</th>
            <th scope="col">{t('common.light')}</th>
            <th scope="col">{t('common.dark')}</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name}>
              <td className={styles.mono}>
                <CopyValue value={`var(${token.cssVar})`}>{token.cssVar}</CopyValue>
              </td>
              <td>
                <span className={styles.pair}>
                  <span className={styles.chip} style={{ background: token.lightHex }} />
                  <span className={styles.mono}>{token.light}</span>
                </span>
              </td>
              <td>
                <span className={styles.pair}>
                  <span className={styles.chip} style={{ background: token.darkHex }} />
                  <span className={styles.mono}>{token.dark}</span>
                </span>
              </td>
              <td className={styles.muted}>{token.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}

const AA = 4.5;
const MAX_RATIO = 21;

export function ContrastTable({ checks }: { readonly checks: readonly ContrastDto[] }) {
  const reduced = useReducedMotion();
  return (
    <Reveal className={styles.tableScroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{t('ui.contrastPair')}</th>
            <th scope="col">{t('ui.theme')}</th>
            <th scope="col">{t('ui.contrastRatio')}</th>
            <th scope="col">{t('ui.contrastGrade')}</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check, index) => (
            <tr key={`${check.theme}-${check.foreground}-${check.background}`}>
              <td className={styles.mono}>
                {check.foreground} / {check.background}
              </td>
              <td className={styles.muted}>{t(`common.${check.theme}`)}</td>
              <td>
                <span className={styles.ratioCell}>
                  <AnimatedNumber value={check.ratio} format={(value) => value.toFixed(2)} className={styles.mono} />
                  <span className={styles.ratioTrack}>
                    <motion.span
                      className={styles.ratioFill}
                      style={{ width: `${(check.ratio / MAX_RATIO) * 100}%` }}
                      initial={reduced ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: duration.slow, ease: ease.out, delay: index * 0.03 }}
                    />
                    <span className={styles.ratioMark} style={{ left: `${(AA / MAX_RATIO) * 100}%` }} />
                  </span>
                </span>
              </td>
              <td>
                <Tag tone={check.grade === 'AAA' || check.grade === 'AA' ? 'neutral' : 'accent'}>{check.grade}</Tag>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}
