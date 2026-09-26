import { useMotionValue, type MotionValue } from 'motion/react';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useMediaQuery } from './use-media-query';
import { normalizeTilt } from './tilt';

const patterns = { light: [8], medium: [20], success: [12, 45, 24] } as const;
type Feedback = keyof typeof patterns;
type TiltStatus = 'off' | 'waiting' | 'active' | 'denied' | 'unavailable';
type OrientationAPI = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };

interface DeviceFeedback {
  x: MotionValue<number>;
  y: MotionValue<number>;
  status: TiltStatus;
  enabled: boolean;
  coarse: boolean;
  reduced: boolean;
  haptics: boolean;
  canVibrate: boolean;
  toggleTilt: () => Promise<void>;
  toggleHaptics: () => void;
  pulse: (feedback: Feedback) => void;
}

const Context = createContext<DeviceFeedback | null>(null);
const silent = () => {};

/** One sensor subscription serves every decorative surface without React renders per sample. */
export function DeviceFeedbackProvider({ children }: { readonly children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const coarse = useMediaQuery('(pointer: coarse)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<TiltStatus>('off');
  const [haptics, setHaptics] = useState(true);
  const [visible, setVisible] = useState(() => !document.hidden);
  const requesting = useRef(false);
  const lastPulse = useRef(-Infinity);
  const canVibrate = typeof navigator.vibrate === 'function';
  const pulse = useCallback(
    (feedback: Feedback) => {
      if (!haptics || !coarse || reduced || document.hidden || !canVibrate) return;
      const now = performance.now();
      if (now - lastPulse.current < 90) return;
      lastPulse.current = now;
      navigator.vibrate([...patterns[feedback]]);
    },
    [haptics, coarse, reduced, canVibrate],
  );

  const toggleTilt = async () => {
    if (requesting.current) return;
    if (enabled) {
      setEnabled(false);
      setStatus('off');
      return;
    }
    if (reduced || !coarse) return;
    const api = window.DeviceOrientationEvent as OrientationAPI | undefined;
    if (!window.isSecureContext || !api) {
      setStatus('unavailable');
      return;
    }
    requesting.current = true;
    try {
      if (api.requestPermission && (await api.requestPermission()) !== 'granted') {
        setStatus('denied');
        return;
      }
      setStatus('waiting');
      setEnabled(true);
      pulse('medium');
    } catch (error) {
      console.error('Unable to request device orientation permission.', error);
      setStatus('denied');
    } finally {
      requesting.current = false;
    }
  };

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (!enabled || !coarse || reduced || !visible) {
      x.set(0);
      y.set(0);
      return;
    }
    let origin: { beta: number; gamma: number } | undefined;
    let received = false;
    const timeout = window.setTimeout(() => {
      if (!received) {
        setStatus('unavailable');
        setEnabled(false);
      }
    }, 4000);
    const reset = () => {
      origin = undefined;
      x.set(0);
      y.set(0);
    };
    const orient = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      if (beta === null || gamma === null || !Number.isFinite(beta) || !Number.isFinite(gamma)) return;
      if (!received) {
        received = true;
        clearTimeout(timeout);
        setStatus('active');
      }
      origin ??= { beta, gamma };
      const tilt = normalizeTilt(beta - origin.beta, gamma - origin.gamma, window.screen.orientation?.angle ?? 0);
      x.set(tilt.x);
      y.set(tilt.y);
    };
    window.addEventListener('deviceorientation', orient, { passive: true });
    window.screen.orientation?.addEventListener('change', reset);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('deviceorientation', orient);
      window.screen.orientation?.removeEventListener('change', reset);
      x.set(0);
      y.set(0);
    };
  }, [enabled, coarse, reduced, visible, x, y]);

  useEffect(() => {
    if (canVibrate && (!haptics || reduced || !visible)) navigator.vibrate(0);
    return () => {
      if (canVibrate) navigator.vibrate(0);
    };
  }, [canVibrate, haptics, reduced, visible]);

  return (
    <Context.Provider
      value={{
        x,
        y,
        status,
        enabled,
        coarse,
        reduced,
        haptics,
        canVibrate,
        toggleTilt,
        toggleHaptics: () => {
          if (!haptics && canVibrate && !reduced) navigator.vibrate([...patterns.light]);
          setHaptics(!haptics);
        },
        pulse,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useDeviceFeedback = () => useContext(Context);
export const useHaptics = () => useDeviceFeedback()?.pulse ?? silent;

/** Adapts the common normalized tilt to each surface's existing spring coordinates. */
export function useTiltTarget(
  x: MotionValue<number>,
  y: MotionValue<number>,
  scale = 1,
  invertY = false,
  active = true,
) {
  const device = useDeviceFeedback();
  const sourceX = device?.x;
  const sourceY = device?.y;
  const enabled = !!device?.enabled && device.coarse && !device.reduced && active;
  useEffect(() => {
    if (!enabled || !sourceX || !sourceY) return;
    const updateX = (value: number) => x.set(value * scale);
    const updateY = (value: number) => y.set(value * scale * (invertY ? -1 : 1));
    updateX(sourceX.get());
    updateY(sourceY.get());
    const stopX = sourceX.on('change', updateX);
    const stopY = sourceY.on('change', updateY);
    return () => {
      stopX();
      stopY();
      x.set(0);
      y.set(0);
    };
  }, [enabled, sourceX, sourceY, x, y, scale, invertY]);
  return enabled;
}
