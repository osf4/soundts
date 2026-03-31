import { SoundcloudCredentialsError } from "../error";
import type {
  SoundcloudCredentialsDump,
  SoundcloudCredentialsOptions,
} from "../types/credentials";
import { calculateExpirationDate } from "../util";

/**
 * Represents params for 'refresh' method
 * @param accessToken new access token
 * @param refreshToken new refresh token
 * @param expiration new expiration time. Can be either a number (ms) or a Date.
 * If the Date provided it is converted to ms
 */
type RefreshParams = {
  accessToken: string;
  refreshToken: string;
  expiration: number | Date;
};

/**
 * Represents application credentials.
 * Provides methods to safely refresh them and a convenient way to calculate expiration time
 */
export class SoundcloudCredentials {
  private _accessToken?: string;
  private _refreshToken?: string;
  private _accessTokenExpiration?: Date;

  public readonly clientId: string;
  public readonly clientSecret: string;

  constructor(options: SoundcloudCredentialsOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;

    if (options.refreshToken) {
      this._refreshToken = options.refreshToken;
    }
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  get accessTokenExpiration(): Date | undefined {
    return this._accessTokenExpiration;
  }

  get accessExpired(): boolean {
    if (!this._accessTokenExpiration) {
      return true;
    }

    return this._accessTokenExpiration?.getTime() < Date.now();
  }

  get canUseRefreshTokenForAuth(): boolean {
    return !!this._refreshToken;
  }

  /**
   * Refreshes the credentials
   * Refresh token can be used only once, so after expiration of access token, both tokens must be updated
   */
  refresh({ refreshToken, accessToken, expiration }: RefreshParams) {
    this._refreshToken = refreshToken;
    this._accessToken = accessToken;

    if (expiration instanceof Date) {
      this._accessTokenExpiration = expiration;
    } else {
      this._accessTokenExpiration = calculateExpirationDate(expiration);
    }
  }

  /**
   * Dumps the credentials to a JSON string
   * @returns {SoundcloudCredentialsDump} JSON dump of SoundCloudCredentials
   */
  dump() {
    const dump: SoundcloudCredentialsDump = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      access_token: this.accessToken,
      access_token_expiration: this.accessTokenExpiration?.getTime(),
    };

    return JSON.stringify(dump);
  }

  /**
   * Loads SoundcloudCredentials from a JSON dump
   * @param dump source of the dump. Can be a JSON string or a readable stream (e.g. file)
   * @returns SoundcloudCredentials from the dump
   */
  static async load(dump: string): Promise<SoundcloudCredentials> {
    const options = JSON.parse(dump) as SoundcloudCredentialsDump;
    SoundcloudCredentials.validateRequiredFields(options);

    return new SoundcloudCredentials({
      clientId: options.client_id,
      clientSecret: options.client_secret,
      refreshToken: options.refresh_token,
      accessToken: options.access_token,
      accessTokenExpiration: options.access_token_expiration,
    });
  }

  private static validateRequiredFields(options: object) {
    if (!SoundcloudCredentials.requiredFieldsProvided(options)) {
      throw new SoundcloudCredentialsError(
        "Fields 'client_id' and 'client_secret' must be provided",
      );
    }
  }

  private static requiredFieldsProvided(json: object) {
    const keys = Object.keys(json);
    return keys.includes("client_id") && keys.includes("client_secret");
  }
}
