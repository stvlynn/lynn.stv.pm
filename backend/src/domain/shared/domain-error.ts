/** Raised when a domain invariant is violated. */
export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export function invariant(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) {
    throw new DomainError(code, message);
  }
}
