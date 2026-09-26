import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeviceFeedbackProvider, useDeviceFeedback } from './device-feedback';

let device: NonNullable<ReturnType<typeof useDeviceFeedback>>;
function Probe() {
  device = useDeviceFeedback()!;
  return (
    <>
      <button onClick={() => void device.toggleTilt()}>Tilt</button>
      <button onClick={() => device.toggleHaptics()}>Haptics</button>
      <button onClick={() => device.pulse('success')}>Success</button>
      <output>{device.status}</output>
    </>
  );
}
const orient = (beta: number | null, gamma: number | null) =>
  act(() => {
    window.dispatchEvent(Object.assign(new Event('deviceorientation'), { beta, gamma }));
  });
const mediaListeners = new Set<() => void>();
let reduceMotion = false;
const permission = vi.fn();
const vibrate = vi.fn();
beforeEach(() => {
  reduceMotion = false;
  mediaListeners.clear();
  permission.mockReset().mockResolvedValue('granted');
  vibrate.mockReset();
  vi.stubGlobal('isSecureContext', true);
  vi.stubGlobal('DeviceOrientationEvent', Object.assign(class {}, { requestPermission: permission }));
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: query.includes('coarse') || (query.includes('reduce') && reduceMotion),
      addEventListener: (_event: string, listener: () => void) => mediaListeners.add(listener),
      removeEventListener: (_event: string, listener: () => void) => mediaListeners.delete(listener),
    })),
  );
  Object.defineProperty(navigator, 'vibrate', { configurable: true, value: vibrate });
  render(
    <DeviceFeedbackProvider>
      <Probe />
    </DeviceFeedbackProvider>,
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});
const enable = async () => {
  await act(async () => {
    fireEvent.click(screen.getByText('Tilt'));
  });
};

describe('device feedback lifecycle', () => {
  it('requests permission only after a click, calibrates and stops on disable', async () => {
    expect(permission).not.toHaveBeenCalled();
    await enable();
    expect(permission).toHaveBeenCalledTimes(1);
    orient(45, 5);
    expect(device.status).toBe('active');
    expect(device.x.get()).toBe(0);
    orient(55, 15);
    expect(device.x.get()).toBe(0.5);
    expect(device.y.get()).toBe(0.5);
    await enable();
    orient(70, 25);
    expect(device.x.get()).toBe(0);
    expect(device.status).toBe('off');
  });
  it('reports denied permission and never starts tracking', async () => {
    permission.mockResolvedValue('denied');
    await enable();
    orient(10, 10);
    expect(device.status).toBe('denied');
    expect(device.enabled).toBe(false);
  });
  it('reports a sensor that sends no valid readings', async () => {
    vi.useFakeTimers();
    await enable();
    orient(null, null);
    act(() => vi.advanceTimersByTime(4000));
    expect(device.status).toBe('unavailable');
    expect(device.enabled).toBe(false);
  });
  it('plays a success rhythm once and honors the off switch', () => {
    fireEvent.click(screen.getByText('Success'));
    fireEvent.click(screen.getByText('Success'));
    expect(vibrate).toHaveBeenCalledWith([12, 45, 24]);
    expect(vibrate).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('Haptics'));
    vibrate.mockClear();
    fireEvent.click(screen.getByText('Success'));
    expect(vibrate).not.toHaveBeenCalled();
  });
  it('pauses while hidden and recalibrates on return', async () => {
    await enable();
    orient(40, 0);
    orient(50, 10);
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    orient(70, 20);
    expect(device.x.get()).toBe(0);
    hidden.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    orient(70, 20);
    expect(device.x.get()).toBe(0);
    orient(80, 30);
    expect(device.x.get()).toBe(0.5);
  });
  it('respects live Reduce Motion changes for both tilt and vibration', async () => {
    await enable();
    orient(40, 0);
    orient(50, 10);
    act(() => {
      reduceMotion = true;
      [...mediaListeners].forEach((listener) => listener());
    });
    expect(device.reduced).toBe(true);
    expect(device.x.get()).toBe(0);
    vibrate.mockClear();
    orient(70, 20);
    fireEvent.click(screen.getByText('Success'));
    expect(device.x.get()).toBe(0);
    expect(vibrate).not.toHaveBeenCalled();
  });
});
