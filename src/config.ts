/**
 * Represents a config with constant settings such as SoundCloud API URL, SoundCloud Auth API URL and etc.
 */
export default {
  apiUrl: "https://api.soundcloud.com",
  authUrl: "https://secure.soundcloud.com",
  defaultRequestHeaders: {
    Accept: "application/json; charset=utf-8",
  },
} as const;
