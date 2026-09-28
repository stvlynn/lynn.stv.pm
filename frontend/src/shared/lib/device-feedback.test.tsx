import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DeviceFeedbackProvider, useDeviceFeedback } from './device-feedback';

let device: NonNullable<ReturnType<typeof useDeviceFeedback>>;
function Probe() {
  device = useDeviceFeedback()!;
  return (
    <>
      <button>Interact with page</button>
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
const mount = async (strict = false) => {
  await act(async () => {
    const app = (
      <DeviceFeedbackProvider>
        <Probe />
      </DeviceFeedbackProvider>
    );
    render(strict ? <StrictMode>{app}</StrictMode> : app);
  });
};

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
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('automatic device feedback', () => {
  it('requests access on page load, calibrates, and tracks tilt without a switch', async () => {
    await mount();
    expect(permission).toHaveBeenCalledTimes(1);
    expect(device.enabled).toBe(true);
    orient(45, 5);
    expect(device.status).toBe('active');
    expect(device.x.get()).toBe(0);
    orient(55, 15);
    expect(device.x.get()).toBe(0.5);
    expect(device.y.get()).toBe(0.5);
  });
  it('requests permission once in Strict Mode', async () => {
    await mount(true);
    expect(permission).toHaveBeenCalledTimes(1);
    expect(device.enabled).toBe(true);
  });
  it('starts on load when the browser has no explicit permission method', async () => {
    vi.stubGlobal('DeviceOrientationEvent', class {});
    await mount();
    expect(device.enabled).toBe(true);
    orient(40, 0);
    orient(50, 10);
    expect(device.x.get()).toBe(0.5);
  });
  it('retries the permission prompt on the first page click when activation is required', async () => {
    permission.mockRejectedValueOnce(new DOMException('Gesture required', 'NotAllowedError'));
    await mount();
    expect(device.enabled).toBe(false);
    expect(permission).toHaveBeenCalledTimes(1);
    await act(async () => {
      fireEvent.click(screen.getByText('Interact with page'));
    });
    expect(permission).toHaveBeenCalledTimes(2);
    expect(device.enabled).toBe(true);
    fireEvent.click(screen.getByText('Interact with page'));
    expect(permission).toHaveBeenCalledTimes(2);
  });
  it('reports denied permission and never starts tracking', async () => {
    permission.mockResolvedValue('denied');
    await mount();
    orient(10, 10);
    expect(device.status).toBe('denied');
    expect(device.enabled).toBe(false);
  });
  it('reports a sensor that sends no valid readings', async () => {
    vi.useFakeTimers();
    await mount();
    orient(null, null);
    act(() => vi.advanceTimersByTime(4000));
    expect(device.status).toBe('unavailable');
    expect(device.enabled).toBe(false);
  });
  it('plays a success rhythm once and honors the off switch for haptics', async () => {
    await mount();
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
    await mount();
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
    await mount();
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
