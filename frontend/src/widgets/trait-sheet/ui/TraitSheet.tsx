import { type CharacterProfile, groupTraitsByPart, toCallouts } from 'entities/character';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import { t } from 'shared/i18n';
import { duration, ease, useHaptics, useMediaQuery } from 'shared/lib';
import {
  Button,
  FigureDrawing,
  figureViews,
  figureViewOrder,
  type FigureView,
  Icon,
  Reveal,
  viewForTrait,
} from 'shared/ui';
import styles from './TraitSheet.module.css';

/** Identity traits and proportions share one annotated figure. */
export function TraitSheet({ profile }: { readonly profile: CharacterProfile }) {
  const pulse = useHaptics();
  const wide = useMediaQuery('(min-width: 1024px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = selected ?? hovered;
  const [view, setView] = useState<FigureView>('front');
  const figurePanel = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const callouts = useMemo(() => toCallouts(profile.traits), [profile.traits]);
  const numbers = useMemo(() => new Map(profile.traits.map((trait, index) => [trait.id, index + 1])), [profile.traits]);
  const groups = useMemo(() => groupTraitsByPart(profile.traits), [profile.traits]);
  const views = {
    front: t('blueprint.frontView'),
    left: t('blueprint.leftView'),
    back: t('blueprint.backView'),
    right: t('blueprint.rightView'),
  };
  const changeView = (next: FigureView) => {
    if (next !== view) pulse('light');
    setView(next);
    setHovered(null);
    if (selected && !(selected in figureViews[next].anchors)) setSelected(null);
  };
  const step = (direction: number) => {
    const index = figureViewOrder.indexOf(view);
    changeView(figureViewOrder[(index + direction + figureViewOrder.length) % figureViewOrder.length]);
  };
  const activateTrait = (id: string) => {
    if (id !== selected) pulse('medium');
    const next = viewForTrait(view, id);
    setView(next);
    setSelected(id);
    setHovered(null);
    const panel = figurePanel.current;
    if (panel && (!wide || panel.getBoundingClientRect().top < 0)) {
      panel.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.layout}>
      <div ref={figurePanel} className={styles.figure}>
        <div
          className={styles.viewControls}
          role="group"
          aria-label={t('blueprint.viewLabel')}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              step(event.key === 'ArrowLeft' ? -1 : 1);
            }
          }}
        >
          <Button iconOnly aria-label={t('blueprint.previousView')} onClick={() => step(-1)}>
            <Icon name="chevronLeft" size={16} />
          </Button>
          <div className={styles.viewOptions}>
            {figureViewOrder.map((option) => (
              <button type="button" key={option} aria-pressed={view === option} onClick={() => changeView(option)}>
                {views[option]}
              </button>
            ))}
          </div>
          <Button iconOnly aria-label={t('blueprint.nextView')} onClick={() => step(1)}>
            <Icon name="chevronRight" size={16} />
          </Button>
        </div>
        <div
          className={styles.drawing}
          onPointerDown={(event) => {
            if (event.pointerType === 'touch') swipe.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            if (!swipe.current) return;
            const dx = event.clientX - swipe.current.x;
            const dy = event.clientY - swipe.current.y;
            swipe.current = null;
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
          }}
          onPointerCancel={() => {
            swipe.current = null;
          }}
        >
          <FigureDrawing
            figure={figureViews[view]}
            label={t('blueprint.viewFigureLabel', { view: views[view] })}
            callouts={wide ? callouts : callouts.filter((callout) => callout.id === active)}
            activeId={active}
            onActiveChange={setHovered}
            focusId={selected}
            colored
            dimensions={{
              unit: t('blueprint.headUnit'),
              centerline: t('blueprint.centerline'),
              heads: t('blueprint.heads'),
            }}
          />
          <AnimatePresence>
            {selected ? (
              <motion.div
                className={styles.reset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.quick, ease: ease.out }}
              >
                <Button
                  size="small"
                  onClick={() => {
                    setSelected(null);
                    setHovered(null);
                  }}
                >
                  {t('character.fullFigure')}
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div id="proportion" className={styles.proportion}>
          <h3 className={styles.part}>{t('character.proportion')}</h3>
          <p className={styles.proportionValue}>
            {profile.proportion.headsTall} {t('blueprint.heads')}
          </p>
          <p className={styles.proportionNote}>{profile.proportion.note}</p>
        </div>
      </div>
      <div>
        <p className={styles.hint}>{t('character.traitsHint')}</p>
        <div className={styles.groups}>
          {groups.map((group, groupIndex) => (
            <Reveal key={group.part} index={groupIndex}>
              <h3 className={styles.part}>{group.part}</h3>
              <ul className={styles.list}>
                {group.traits.map((trait) => (
                  <li key={trait.id}>
                    <button
                      type="button"
                      className={styles.trait}
                      data-active={active === trait.id}
                      aria-pressed={selected === trait.id}
                      onClick={() => activateTrait(trait.id)}
                      onPointerEnter={() => setHovered(trait.id)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(trait.id)}
                      onBlur={() => setHovered(null)}
                    >
                      <span className={styles.number}>{String(numbers.get(trait.id) ?? 0).padStart(2, '0')}</span>
                      <span>
                        <span className={styles.label}>{trait.label}</span>
                        <span className={styles.detail}>{trait.detail}</span>
                      </span>
                      {trait.swatch ? (
                        <span
                          className={styles.chip}
                          style={{ background: trait.swatch.hex }}
                          title={trait.swatch.hex}
                        />
                      ) : (
                        <span />
                      )}
                    </button>
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
