import { useState } from 'react';
import { t } from 'shared/i18n';
import { Button, Icon, Reveal, SegmentedControl, Switch, Tag, TextField } from 'shared/ui';
import styles from './Foundations.module.css';

type Density = 'compact' | 'regular' | 'airy';

/** Live specimens of the interface primitives this site is built from. */
export function ComponentBoard() {
  const [enabled, setEnabled] = useState(true);
  const [density, setDensity] = useState<Density>('regular');
  const [caption, setCaption] = useState('');
  return (
    <div className={styles.board}>
      <Reveal className={styles.specimen}>
        <span className={styles.label}>{t('ui.specimen.button')}</span>
        <div className={styles.row}>
          <Button variant="ink">{t('ui.specimen.primary')}</Button>
          <Button variant="accent">
            {t('ui.specimen.accent')}
            <Icon name="arrowRight" size={14} />
          </Button>
        </div>
        <div className={styles.row}>
          <Button variant="outline">{t('ui.specimen.ghost')}</Button>
          <Button variant="ghost" iconOnly aria-label={t('common.copy')}>
            <Icon name="copy" />
          </Button>
          <Button variant="outline" disabled>
            {t('ui.specimen.primary')}
          </Button>
        </div>
      </Reveal>
      <Reveal index={1} className={styles.specimen}>
        <span className={styles.label}>{t('ui.specimen.tagGroup')}</span>
        <div className={styles.row}>
          <Tag>{t('ui.specimen.badge')}</Tag>
          <Tag tone="accent">{t('ui.specimen.badgeAccent')}</Tag>
        </div>
        <SegmentedControl
          label={t('ui.space')}
          value={density}
          onChange={setDensity}
          options={[
            { value: 'compact', label: '4' },
            { value: 'regular', label: '8' },
            { value: 'airy', label: '16' },
          ]}
        />
      </Reveal>
      <Reveal index={2} className={styles.specimen}>
        <span className={styles.label}>{t('ui.specimen.fieldGroup')}</span>
        <TextField
          label={t('ui.specimen.inputLabel')}
          placeholder={t('ui.specimen.inputPlaceholder')}
          value={caption}
          onChange={setCaption}
          meta={t('sticker.composerCount', { count: [...caption].length, max: 12 })}
        />
        <Switch label={t('ui.specimen.switchLabel')} checked={enabled} onChange={setEnabled} />
      </Reveal>
    </div>
  );
}
