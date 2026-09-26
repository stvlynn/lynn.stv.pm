/** Raised when a use case cannot find the requested resource. */
export class NotFoundError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}
