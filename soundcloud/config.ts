/**
 * Represents a config with constant settings such as SoundCloud API URL, SoundCloud Auth API URL and etc.
 */
export default {
  apiUrl: "https://api.soundcloud.com" as const,
  authUrl: "https://secure.soundcloud.com" as const,
  defaultRequestHeaders: {
    Accept: "application/json; charset=utf-8",
  } as const,
} as const;
