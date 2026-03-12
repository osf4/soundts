import { BaseModule } from "@/modules/base.module";
import {
  GetPlaylistByUrnParams,
  GetPlaylistRepostersParams,
  GetPlaylistTracksParams,
  PlaylistsSearchParams,
} from "@/types/parameters/playlists";
import { PlaylistSchema, TrackSchema } from "@/types/schemas";

/**
 * Provides methods for accessing playlists.
 * See more at [Playlists](https://developers.soundcloud.com/docs/api/explorer/open-api#/playlists)
 */
export class PlaylistModule extends BaseModule {
  /**
   * Searches for playlists by provided params
   * @param params params for filtering the playlists
   * @returns Paginator which provides page manipulation of playlists
   */
  async search(params: PlaylistsSearchParams) {
    this.logger?.info({
      message: "Search for playlists",
      query: params.q,
    });

    return await this.baseSearch<PlaylistSchema>({
      endpoint: "playlists",
      paginatorId: `Paginator search_playlists: ${params.q}`,
      params,
    });
  }

  /**
   * Searches for playlist by urn
   * @param urn
   * @returns playlist with provided urn
   */
  async getByUrn(urn: string, params?: GetPlaylistByUrnParams) {
    this.logger?.info({
      message: "Get playlist by urn",
      urn,
    });

    return await this.baseGetByUrn<PlaylistSchema>({
      endpoint: "playlists",
      params,
      urn,
    });
  }

  /**
   * Returns list of playlists's reposters
   * @param urn user urn
   * @param params params for filtering the reposters
   * @returns Paginator which provides page manipulation of reposters
   */
  async getReposters(urn: string, params?: GetPlaylistRepostersParams) {
    this.logger?.info({
      message: "Get playlist reposters",
      urn,
    });

    return await this.baseGetReposters({
      endpoint: "playlists",
      paginatorId: `Paginator get_playlist_reposters: ${urn}`,
      params,
      urn,
    });
  }

  /**
   * Returns list of playlists's tracks
   * @param urn user urn
   * @param params params for filtering the tracks
   * @returns Paginator which provides page manipulation of tracks
   */
  async getTracks(urn: string, params?: GetPlaylistTracksParams) {
    this.logger?.info({
      message: "Get playlist tracks",
      urn,
    });

    return await this.baseGetCollection<TrackSchema>({
      url: `playlists/${urn}/tracks`,
      addLinkedPartitioning: false,
      paginatorId: `Paginator get_playlist_tracks: ${urn}`,
      params,
    });
  }
}
