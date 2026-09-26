import { type PvSpec, type Still, timecodeToSeconds } from 'entities/pv-guide';
import { motion, useReducedMotion } from 'motion/react';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import { NumberTicker, Reveal, RuleList, Section, Tag, TiltCard, Tooltip } from 'shared/ui';
import styles from './PvGuide.module.css';

function Timeline({ spec }: { readonly spec: PvSpec }) {
  const position = (still: Still) =>
    (timecodeToSeconds(still.timecode, spec.format.fps) / spec.format.durationSeconds) * 100;
  return (
    <div className={styles.timeline}>
      <div className={styles.axis} aria-label={t('pv.timeline')}>
        {spec.stills.map((still) => (
          <span key={still.id} className={styles.markerSlot} style={{ left: `${position(still)}%` }}>
            <Tooltip
              side="top"
              content={
                <span className={styles.preview}>
                  <img src={still.image.src} alt="" className={styles.previewImage} />
                  <span className={styles.previewCode}>{still.timecode}</span>
                </span>
              }
              className="p-1"
            >
              <button type="button" className={styles.marker} aria-label={`${still.timecode} ${still.caption}`} />
            </Tooltip>
          </span>
        ))}
      </div>
      <div className={styles.axisLabels}>
        <span>0:00</span>
        <span>{spec.format.runtime}</span>
      </div>
    </div>
  );
}

function Pipeline({ spec }: { readonly spec: PvSpec }) {
  const reduced = useReducedMotion();
  return (
    <ol className={styles.pipeline}>
      <motion.span
        aria-hidden="true"
        className={styles.pipelineLine}
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: duration.drawn * 0.5, ease: ease.emphasized }}
      />
      {spec.pipeline.map((step, index) => (
        <Reveal as="li" key={step.id} index={index} className={styles.step}>
          <span className={styles.node}>{index + 1}</span>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepBody}>{step.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function PvGuide({ spec }: { readonly spec: PvSpec }) {
  const reduced = useReducedMotion();
  const { format } = spec;
  return (
    <>
      <Section id="format" title={t('pv.format')} code="SPC-06.1" aside={spec.credit}>
        <div className={styles.formatLayout}>
          <Reveal>
            <dl className={styles.format}>
              <div className={styles.cell}>
                <dt>{t('pv.resolution')}</dt>
                <dd>
                  <NumberTicker value={format.width} />×<NumberTicker value={format.height} />
                </dd>
              </div>
              <div className={styles.cell}>
                <dt>{t('pv.frameRate')}</dt>
                <dd>
                  <NumberTicker value={format.fps} suffix={` ${t('pv.fpsUnit')}`} />
                </dd>
              </div>
              <div className={styles.cell}>
                <dt>{t('pv.runtime')}</dt>
                <dd>{format.runtime}</dd>
              </div>
              <div className={styles.cell}>
                <dt>{t('pv.frames')}</dt>
                <dd>
                  <NumberTicker value={format.frames} locale />
                </dd>
              </div>
              <div className={`${styles.cell} ${styles.cellWide}`}>
                <dt>{t('pv.audio')}</dt>
                <dd>{format.audio}</dd>
              </div>
            </dl>
          </Reveal>
          <Reveal index={1}>
            <video
              className={styles.video}
              src={spec.excerpt.src}
              poster={spec.excerpt.poster}
              controls
              muted
              playsInline
              preload="metadata"
              autoPlay={!reduced}
              aria-label={`${t('pv.excerpt')}: ${spec.title}`}
            />
          </Reveal>
        </div>
        <Timeline spec={spec} />
      </Section>
      <Section id="identity" title={t('pv.identity')} code="SPC-06.2">
        <div className={styles.identity}>
          {spec.identityLock.map((item, index) => (
            <Reveal key={item} index={index}>
              <Tag tone={index === 0 ? 'accent' : 'neutral'}>{item}</Tag>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section id="costumes" title={t('pv.costumes')} code="SPC-06.3">
        <div className={styles.costumes}>
          <TiltCard max={5}>
            <img
              src={spec.costumeSheet.src}
              alt={spec.costumeSheet.alt}
              width={spec.costumeSheet.width}
              height={spec.costumeSheet.height}
              loading="lazy"
              className={styles.costumeImage}
            />
          </TiltCard>
          <div className={styles.costumeList}>
            {spec.costumes.map((costume, index) => (
              <Reveal key={costume.id} index={index}>
                <h3 className={styles.role}>{costume.role}</h3>
                <ul className={styles.garments}>
                  {costume.garments.map((garment) => (
                    <li key={garment}>{garment}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
      <Section id="rules" title={t('pv.rules')} code="SPC-06.4">
        <RuleList rules={spec.rules} />
      </Section>
      <Section id="pipeline" title={t('pv.pipeline')} code="SPC-06.5">
        <Pipeline spec={spec} />
      </Section>
      <Section id="stills" title={t('pv.stills')} code="SPC-06.6">
        <ul className={styles.strip}>
          {spec.stills.map((still) => (
            <li key={still.id} className={styles.still}>
              <img
                src={still.image.src}
                alt={still.image.alt}
                width={still.image.width}
                height={still.image.height}
                loading="lazy"
                className={styles.stillImage}
              />
              <span className={styles.stillMeta}>
                <span>{still.timecode}</span>
                <span>{still.id}</span>
              </span>
              <p className={styles.stillCaption}>{still.caption}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
