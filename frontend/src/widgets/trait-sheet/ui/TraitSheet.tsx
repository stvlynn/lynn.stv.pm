import { type CharacterProfile, groupTraitsByPart, toCallouts } from 'entities/character';
import { useMemo, useState } from 'react';
import { t } from 'shared/i18n';
import { useMediaQuery } from 'shared/lib';
import { FigureDrawing, Reveal } from 'shared/ui';
import styles from './TraitSheet.module.css';

/** Identity traits as a list and as callouts; hovering either highlights both. */
export function TraitSheet({ profile }: { readonly profile: CharacterProfile }) {
  const wide = useMediaQuery('(min-width: 1024px)');
  const [active, setActive] = useState<string | null>(null);
  const callouts = useMemo(() => toCallouts(profile.traits), [profile.traits]);
  const numbers = useMemo(() => new Map(profile.traits.map((trait, index) => [trait.id, index + 1])), [profile.traits]);
  const groups = useMemo(() => groupTraitsByPart(profile.traits), [profile.traits]);

  return (
    <div className={styles.layout}>
      <div className={styles.drawing}>
        <FigureDrawing
          label={t('blueprint.figureLabel')}
          callouts={wide ? callouts : []}
          activeId={active}
          onActiveChange={setActive}
          draw
        />
      </div>
      <div>
        <p className={styles.hint}>{t('character.traitsHint')}</p>
        <div className={styles.groups}>
          {groups.map((group, groupIndex) => (
            <Reveal key={group.part} index={groupIndex}>
              <h3 className={styles.part}>{group.part}</h3>
              <ul className={styles.list}>
                {group.traits.map((trait) => (
                  <li
                    key={trait.id}
                    className={styles.trait}
                    data-active={active === trait.id}
                    tabIndex={0}
                    onPointerEnter={() => setActive(trait.id)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(trait.id)}
                    onBlur={() => setActive(null)}
                  >
                    <span className={styles.number}>{String(numbers.get(trait.id) ?? 0).padStart(2, '0')}</span>
                    <div>
                      <p className={styles.label}>{trait.label}</p>
                      <p className={styles.detail}>{trait.detail}</p>
                    </div>
                    {trait.swatch ? (
                      <span className={styles.chip} style={{ background: trait.swatch.hex }} title={trait.swatch.hex} />
                    ) : (
                      <span />
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
