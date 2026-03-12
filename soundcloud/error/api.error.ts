import { ErrorSchema } from "@/types/schemas";

/**
 * Represents error that is thrown when Soundcloud API returns a error.
 * Cause property contains the original object of the error (code, message, link).
 */
export class SoundcloudAPIError extends Error {
  override name = "SoundcloudAPIError";

  constructor(schema: ErrorSchema) {
    super(schema.message, {
      cause: schema,
    });
  }
}
