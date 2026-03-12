/**
 * Represents error that is thrown when you try to call 'next' method of Paginator when 'nextPageAvailable' is false
 */
export class LastPageError extends Error {
  override name = "LastPageError";

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
