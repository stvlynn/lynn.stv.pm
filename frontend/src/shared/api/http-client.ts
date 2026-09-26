import { API_PREFIX, type ApiEnvelope } from '@lynn/contracts';

/** A request that reached the API and came back unsuccessful. */
export class ApiRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_PREFIX}${path}`, {
    ...init,
    headers: { accept: 'application/json', ...(init?.body ? { 'content-type': 'application/json' } : {}) },
  });
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new ApiRequestError(
      'NON_JSON_RESPONSE',
      `Expected JSON from ${path}, got ${contentType || 'nothing'}`,
      response.status,
    );
  }
  const envelope = (await response.json()) as ApiEnvelope<T>;
  if (!envelope.success) {
    throw new ApiRequestError(envelope.error.code, envelope.error.message, response.status);
  }
  return envelope.data;
}

export const getJson = <T>(path: string, signal?: AbortSignal): Promise<T> =>
  request<T>(path, signal ? { signal } : undefined);

export const postJson = <T>(path: string, body: unknown): Promise<T> =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });
