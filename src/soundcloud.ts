import { ApiFetcher } from "./api-fetcher";
import type { BaseLogger } from "./logger";
import { SoundcloudCredentials } from "./models";
import { PlaylistModule, TrackModule, UserModule } from "./modules";

/**
 * Represents options for Soundcloud client
 * @param credentials contains client_secret, client_id, access and refresh tokens for authorization at SoundCloud
 * @param logger provides logging of SoundCloud API requests
 */
export type SoundcloudOptions = {
  credentials: SoundcloudCredentials;
  logger?: BaseLogger;
};

/**
 * Represents the entry point to request SoundCloud API
 * @param options provides settings for Soundcloud Client
 */
export class Soundcloud {
  /**
   * Provides automatic authorization and refreshing the credentials
   */
  public readonly fetcher: ApiFetcher;

  /**
   * Provides logging for all the endpoints and requests.
   * The preffered way of usage is to create a Pino logger and provide it through 'logger.child' method.
   */
  public readonly logger?: BaseLogger;

  /**
   * Provides methods for accessing playlists.
   * See more at [Playlists](https://developers.soundcloud.com/docs/api/explorer/open-api#/playlists)
   */
  public readonly playlists: PlaylistModule;

  /**
   * Provides methods for accessing tracks.
   * See more at [Tracks](https://developers.soundcloud.com/docs/api/explorer/open-api#/tracks)
   */
  public readonly tracks: TrackModule;

  /**
   * Provides methods for accessing users.
   * See more at [Users](https://developers.soundcloud.com/docs/api/explorer/open-api#/users)
   */
  public readonly users: UserModule;

  constructor(options: SoundcloudOptions) {
    this.logger = options.logger;

    this.fetcher = new ApiFetcher(
      options.credentials,
      this.logger?.child({ scope: "api-fetcher" }),
    );

    this.playlists = new PlaylistModule(
      this.fetcher,
      this.logger?.child({ scope: "playlist-module" }),
    );

    this.tracks = new TrackModule(
      this.fetcher,
      this.logger?.child({ scope: "track-module" }),
    );

    this.users = new UserModule(
      this.fetcher,
      this.logger?.child({ scope: "user-module" }),
    );
  }

  /**
   * Returns credentials that are used to authorize at SoundCloud API
   */
  get credentials() {
    return this.fetcher.credentials;
  }

  /**
   * Signs in via provided client_id and client_secret and initializes credentials with new access and refresh tokens.
   * See more at [Authorization via Client Credentials Token Exchange Flow](https://developers.soundcloud.com/docs/api/guide#authentication)
   */
  async signIn() {
    return await this.fetcher.signIn();
  }

  /**
   * Invalidates access and refresh tokens
   * See more at [Sign out](https://developers.soundcloud.com/docs/api/guide#authentication)
   */
  async signOut() {
    await this.fetcher.signOut();
  }
}
