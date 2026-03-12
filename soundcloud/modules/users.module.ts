import config from "@/config";
import { ApiUrl } from "@/models";
import { BaseModule } from "@/modules/base.module";
import {
  GetUserFollowersParams,
  GetUserFollowingsParams,
  GetUserPlaylistsParams,
  GetUserTracksParams,
  GetUserWebProfilesParams,
  UsersSearchParams,
} from "@/types/parameters/users";
import { PlaylistSchema, UserSchema, WebProfileSchema } from "@/types/schemas";

/**
 * Provides methods for accessing users.
 * See more at [Users](https://developers.soundcloud.com/docs/api/explorer/open-api#/users)
 */
export class UserModule extends BaseModule {
  /**
   * Searches for users by provided params
   * @param params params for filtering the users
   * @returns Paginator which provides page manipulation of users
   */
  async search(params: UsersSearchParams) {
    this.logger?.info({
      message: "Search for users",
      query: params.q,
    });

    return await this.baseSearch<UserSchema>({
      endpoint: "users",
      paginatorId: `Paginator search_users: ${params.q}`,
      params,
    });
  }

  /**
   * Searches for user by urn
   * @param urn
   * @returns user with provided urn
   */
  async getByUrn(urn: string) {
    this.logger?.info({
      message: "Get user by urn",
      urn,
    });

    return await this.baseGetByUrn<UserSchema>({
      endpoint: "users",
      urn,
    });
  }

  /**
   * Returns list of user's followers
   * @param urn user urn
   * @param params params for filtering the folowers
   * @returns Paginator which provides page manipulation of followers
   */
  async getFollowers(urn: string, params?: GetUserFollowersParams) {
    this.logger?.info({
      message: "Get user followers",
      urn,
    });

    return await this.baseGetCollection<UserSchema>({
      url: `users/${urn}/followers`,
      paginatorId: `Paginator get_user_followers: ${urn}`,
      addLinkedPartitioning: false,
      params,
    });
  }

  /**
   * Returns list of user's followings
   * @param urn user urn
   * @param params params for filtering the followings
   * @returns Paginator which provides page manipulation of followings
   */
  async getFollowings(urn: string, params?: GetUserFollowingsParams) {
    this.logger?.info({
      message: "Get user followings",
      urn,
    });

    return await this.baseGetCollection<UserSchema>({
      url: `users/${urn}/followings`,
      paginatorId: `Paginator get_user_followings: ${urn}`,
      addLinkedPartitioning: false,
      params,
    });
  }

  /**
   * Returns user's playlists
   * @param urn user urn
   * @param paramsparams for filtering the playlists
   * @returns Paginator which provides page manipulation of playlists
   */
  async getPlaylists(urn: string, params?: GetUserPlaylistsParams) {
    this.logger?.info({
      message: "Get user playlists",
      urn,
    });

    return await this.baseGetCollection<PlaylistSchema>({
      url: `users/${urn}/playlists`,
      paginatorId: `Paginator get_user_playlists: ${urn}`,
      addLinkedPartitioning: true,
      params,
    });
  }

  /**
   * Returns user's tracks
   * @param urn user urn
   * @param paramsparams for filtering the tracks
   * @returns Paginator which provides page manipulation of tracks
   */
  async getTracks(urn: string, params?: GetUserTracksParams) {
    this.logger?.info({
      message: "Get user tracks",
      urn,
    });

    return await this.baseGetCollection<PlaylistSchema>({
      url: `users/${urn}/tracks`,
      paginatorId: `Paginator get_user_tracks: ${urn}`,
      addLinkedPartitioning: true,
      params,
    });
  }

  /**
   * Returns user's web-profiles
   * @param urn user urn
   * @param paramsparams for filtering the web-profiles
   * @returns array of list profiles
   */
  async getWebProfiles(urn: string, params?: GetUserWebProfilesParams) {
    this.logger?.info({
      message: "Get user web-profiles",
      urn,
    });

    const apiUrl = new ApiUrl(`users/${urn}/web-profiles`, config.apiUrl);

    apiUrl.initializeQueryParams(params);

    return await this.fetcher.fetch<WebProfileSchema[]>({
      automaticallyAuthorizeClient: true,
      input: apiUrl,
    });
  }
}
