import type { ApiEnvelope } from '@lynn/contracts';

export const ok = <T>(data: T): ApiEnvelope<T> => ({ success: true, data, error: null });

export const fail = (code: string, message: string): ApiEnvelope<never> => ({
  success: false,
  data: null,
  error: { code, message },
});
