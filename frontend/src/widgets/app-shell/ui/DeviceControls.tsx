import { t } from 'shared/i18n';
import { useDeviceFeedback } from 'shared/lib';
import { Button } from 'shared/ui';
import styles from './MobileBar.module.css';

/** Permission is requested only from this explicit user gesture. */
export function DeviceControls({ compact = false }: { readonly compact?: boolean }) {
  const device = useDeviceFeedback();
  if (!device?.coarse) return null;
  const { enabled, reduced, toggleTilt, haptics, canVibrate, toggleHaptics } = device;
  return (
    <div className={styles.deviceControls}>
      <Button
        size="small"
        variant={enabled && !reduced ? 'accent' : 'ghost'}
        aria-pressed={enabled && !reduced}
        disabled={reduced}
        onClick={() => void toggleTilt()}
      >
        {enabled ? t('device.tiltOn') : t('device.tilt')}
      </Button>
      {!compact && (
        <>
          <Button
            size="small"
            variant="ghost"
            aria-pressed={haptics && !reduced && canVibrate}
            disabled={!canVibrate || reduced}
            onClick={toggleHaptics}
          >
            {t('device.haptics')}
          </Button>
          {!canVibrate && <p>{t('device.noHaptics')}</p>}
        </>
      )}
      {!compact && <DeviceStatus />}
    </div>
  );
}

export function DeviceStatus() {
  const device = useDeviceFeedback();
  if (!device?.coarse) return null;
  const { reduced, status } = device;
  const message = reduced
    ? t('device.reduced')
    : status === 'denied'
      ? t('device.denied')
      : status === 'unavailable'
        ? t('device.unavailable')
        : status === 'waiting'
          ? t('device.waiting')
          : null;
  return message ? (
    <p className={styles.deviceStatus} role="status">
      {message}
    </p>
  ) : null;
}
