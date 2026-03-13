/**
 * Represents error that is thrown when the provided credentials dump is not a JSON string
 * with "client_id" and "client_secret" fields
 */
export class SoundcloudCredentialsError extends Error {
  override name = "SoundcloudCredentialsError";

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
  }
}
