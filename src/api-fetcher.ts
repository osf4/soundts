import config from "./config";
import { SoundcloudAPIError } from "./error";
import type { BaseLogger } from "./logger";
import { SoundcloudCredentials } from "./models";
import type { ErrorSchema, SignInSchema } from "./types/schemas";
import { appendHeaders, encodeCredentials, getJson } from "./util";

/**
 * Represents params for 'fetch' method
 * @param input input for default fetch function
 * @param init init params for default fetch function
 * @param automaticallyAuthorizeClient if true, automatically appends Authorization header to the request.
 * If the access token is expired, initiates [Refreshing Tokens](https://developers.soundcloud.com/docs/api/guide#authentication)
 * @param returnBodyStream if true, does not convert body from JSON to plain JavaScript object and returns raw 'response.body' stream
 */
interface FetchParams {
  input: string | URL | Request;
  init?: RequestInit;
  automaticallyAuthorizeClient: boolean;
  returnRawBodyStream?: boolean;
}

/**
 * Represents params for utility 'appendDefaultHeaders' method
 * @param init default RequestInit which contains headers of the request
 * @param setAuthorizationHeader if true, appends Authorization header to the request
 */
interface SetDefaultHeadersParams {
  init?: RequestInit;
  setAuthorizationHeader: boolean;
}

/**
 * Represents a native class for fetching SoundCloud API.
 * Provides automatic revalidation of access and refresh tokens
 */
export class ApiFetcher {
  constructor(
    public readonly credentials: SoundcloudCredentials,
    public readonly logger?: BaseLogger,
  ) {}

  async signIn() {
    this.logger?.info({ message: "Sign in via credentials" });

    const encodedCredentials = encodeCredentials(
      this.credentials.clientId,
      this.credentials.clientSecret,
    );

    const response = await this.fetch<SignInSchema>({
      automaticallyAuthorizeClient: false,
      input: `${config.authUrl}/oauth/token` as const,
      init: {
        method: "POST",
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }),
      },
    });

    this.credentials.refresh({
      refreshToken: response.refresh_token,
      accessToken: response.access_token,
      expiration: response.expires_in,
    });

    return response;
  }

  async signOut() {
    this.logger?.info({ message: "Sign out" });

    await this.fetch({
      automaticallyAuthorizeClient: false,
      returnRawBodyStream: true,
      input: `${config.apiUrl}/sign-out` as const,
      init: {
        method: "POST",
      },
    });
  }

  /**
   * Fetches SoundCloud api with automatic authorization if needed
   * @param params provides params of request. If 'returnRawBodyStream' is true, returns a readable stream from 'response.body'
   */
  async fetch(
    options: FetchParams & { returnRawBodyStream: true },
  ): Promise<ReadableStream>;

  /**
   * Fetches SoundCloud api with automatic authorization if needed
   * @param params provides params of request. If 'returnRawBodyStream' is false, so returns 'Schema' type
   */
  async fetch<Schema>(
    options: FetchParams & { returnRawBodyStream?: false },
  ): Promise<Schema>;

  async fetch<Schema>(params: FetchParams) {
    if (params.automaticallyAuthorizeClient) {
      await this.refreshAccessIfExpired();
    }

    params.init = this.appendDefaultHeaders({
      setAuthorizationHeader: params.automaticallyAuthorizeClient,
      init: params.init,
    });

    this.logger?.debug({
      message: "Send HTTP request",
      url: params.input,
      method: params.init.method ?? "GET",
    });

    const response = await fetch(params.input, params.init);

    if (!response.ok) {
      const error = await getJson<ErrorSchema>(response);

      this.logger?.error({
        message: `Error occured during fetch`,
        url: params.input,
        error,
      });

      throw new SoundcloudAPIError(error);
    }

    return params.returnRawBodyStream
      ? response.body
      : await getJson<Schema>(response);
  }

  private appendDefaultHeaders(params: SetDefaultHeadersParams) {
    if (params.setAuthorizationHeader) {
      return appendHeaders(params.init, {
        Authorization: `Bearer ${this.credentials.accessToken}`,
        ...config.defaultRequestHeaders,
      });
    }

    return appendHeaders(params.init, config.defaultRequestHeaders);
  }

  private async refreshAccessIfExpired() {
    if (!this.credentials.accessExpired) {
      return;
    }

    this.logger?.debug({
      message: "Refresh access via Client Credentials Token Exchange Flow",
    });

    if (!this.credentials.canUseRefreshTokenForAuth) {
      this.logger?.debug({ message: "Refresh token is invalid" });
      return await this.signIn();
    }

    const response = await this.fetch<SignInSchema>({
      automaticallyAuthorizeClient: false,
      input: `${config.authUrl}/oauth/token` as const,
      init: {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.credentials.refreshToken!,
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
        }),
      },
    });

    this.credentials.refresh({
      refreshToken: response.refresh_token,
      accessToken: response.access_token,
      expiration: response.expires_in,
    });

    return response;
  }
}
