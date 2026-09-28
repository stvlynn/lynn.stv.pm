import { t } from 'shared/i18n';
import { useDeviceFeedback } from 'shared/lib';
import { Button } from 'shared/ui';
import styles from './MobileBar.module.css';

/** Optional vibration control; tilt permission is managed automatically. */
export function DeviceControls() {
  const device = useDeviceFeedback();
  if (!device?.coarse) return null;
  const { reduced, haptics, canVibrate, toggleHaptics } = device;
  return (
    <div className={styles.deviceControls}>
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
      <DeviceStatus />
    </div>
  );
}

export function DeviceStatus() {
  const device = useDeviceFeedback();
  if (!device?.coarse) return null;
  const { status } = device;
  const message = status === 'denied' ? t('device.denied') : status === 'unavailable' ? t('device.unavailable') : null;
  return message ? (
    <p className={styles.deviceStatus} role="status">
      {message}
    </p>
  ) : null;
}
