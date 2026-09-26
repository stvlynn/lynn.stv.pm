import type { UiSpec } from 'entities/design-token';
import { t } from 'shared/i18n';
import { Reveal, Section } from 'shared/ui';
import { ColorRamps, ContrastTable, SemanticTable } from './Colors';
import { ComponentBoard } from './Components';
import styles from './Foundations.module.css';
import { DurationScale, EasingBoard } from './Motion';
import { ElevationScale, RadiusScale, SpaceScale } from './Scales';
import { FontFamilies, TypeScale } from './Type';

/** The full UI specification, one section per token family. */
export function UiFoundations({ spec }: { readonly spec: UiSpec }) {
  return (
    <>
      <Section id="principles" title={t('ui.principles')} code="SPC-04.1">
        <ul className={styles.principles}>
          {spec.principles.map((principle, index) => (
            <Reveal as="li" key={principle.id} index={index} className={styles.principle}>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </Reveal>
          ))}
        </ul>
      </Section>
      <Section id="ramps" title={t('ui.ramps')} code="SPC-04.2">
        <ColorRamps ramps={spec.ramps} />
      </Section>
      <Section id="semantic" title={t('ui.semantic')} code="SPC-04.3">
        <SemanticTable tokens={spec.semantic} />
      </Section>
      <Section id="contrast" title={t('ui.contrast')} code="SPC-04.4">
        <ContrastTable checks={spec.contrast} />
      </Section>
      <Section id="typography" title={t('ui.typography')} code="SPC-04.5">
        <FontFamilies fonts={spec.fonts} />
        <TypeScale styles={spec.typeStyles} sample={t('ui.typeSample')} />
      </Section>
      <Section id="space" title={t('ui.space')} code="SPC-04.6">
        <SpaceScale tokens={spec.space} />
      </Section>
      <Section id="radius" title={t('ui.radius')} code="SPC-04.7">
        <RadiusScale tokens={spec.radii} />
      </Section>
      <Section id="elevation" title={t('ui.elevation')} code="SPC-04.8">
        <ElevationScale tokens={spec.shadows} />
      </Section>
      <Section id="motion" title={t('ui.motion')} code="SPC-04.9">
        <EasingBoard easings={spec.easings} />
        <DurationScale tokens={spec.durations} />
      </Section>
      <Section id="components" title={t('ui.components')} code="SPC-04.10">
        <ComponentBoard />
      </Section>
    </>
  );
}
