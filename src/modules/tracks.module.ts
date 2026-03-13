import { createWriteStream, WriteStream } from "fs";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import config from "../config";
import { ApiUrl } from "../models";
import { BaseModule } from "../modules/base.module";
import type {
  GetTrackByUrnParams,
  GetTrackCommentsParams,
  GetTrackFavoritersParams,
  GetTrackRelatedParams,
  GetTrackRepostersParams,
  TracksSearchParams,
} from "../types/parameters/tracks";
import type {
  CommentSchema,
  TrackLinks,
  TrackSchema,
  UserSchema,
} from "../types/schemas";

/**
 * Provides methods for accessing tracks.
 * See more at [Tracks](https://developers.soundcloud.com/docs/api/explorer/open-api#/tracks)
 */
export class TrackModule extends BaseModule {
  /**
   * Searches for tracks by provided params
   * @param params params for filtering the tracks
   * @returns Paginator which provides page manipulation of tracks
   */
  async search(params: TracksSearchParams) {
    this.logger?.info({
      message: "Search for tracks",
      query: params.q,
    });

    return await this.baseSearch<TrackSchema>({
      endpoint: "tracks",
      params,
      paginatorId: `Paginator search_tracks: ${params.q}`,
    });
  }

  /**
   * Searches for track by urn
   * @param urn
   * @returns track with provided urn
   */
  async getByUrn(urn: string, params?: GetTrackByUrnParams) {
    this.logger?.info({
      message: "Get track by urn",
      urn,
    });

    return await this.baseGetByUrn<TrackSchema>({
      endpoint: "tracks",
      params,
      urn,
    });
  }

  /**
   * Returns list of track's reposters
   * @param urn user urn
   * @param params params for filtering the reposters
   * @returns Paginator which provides page manipulation of reposters
   */
  async getReposters(urn: string, params?: GetTrackRepostersParams) {
    this.logger?.info({
      message: "Get track reposters",
      urn,
    });

    return await this.baseGetReposters({
      endpoint: "tracks",
      paginatorId: `Paginator get_track_reposters: ${urn}`,
      params,
      urn,
    });
  }

  /**
   * Returns list of track's comments
   * @param urn user urn
   * @param params params for filtering the comments
   * @returns Paginator which provides page manipulation of comments
   */
  async getComments(urn: string, params?: GetTrackCommentsParams) {
    this.logger?.info({
      message: "Get track comments",
      urn,
    });

    return await this.baseGetCollection<CommentSchema>({
      url: `tracks/${urn}/comments`,
      addLinkedPartitioning: true,
      paginatorId: `Paginator get_track_comments: ${urn}`,
      params,
    });
  }

  /**
   * Returns list of track's favoriters
   * @param urn user urn
   * @param params params for filtering the favoriters
   * @returns Paginator which provides page manipulation of favoriters
   */
  async getFavoriters(urn: string, params?: GetTrackFavoritersParams) {
    this.logger?.info({
      message: "Get track by favoriters",
      urn,
    });

    return await this.baseGetCollection<UserSchema>({
      url: `tracks/${urn}/favoriters`,
      addLinkedPartitioning: true,
      paginatorId: `Paginator get_track_favoriters: ${urn}`,
      params,
    });
  }

  /**
   * Returns list of track's related tracks
   * @param urn user urn
   * @param params params for filtering the related tracks
   * @returns Paginator which provides page manipulation of related tracks
   */
  async getRelated(urn: string, params?: GetTrackRelatedParams) {
    this.logger?.info({
      message: "Get track related",
      urn,
    });

    return await this.baseGetCollection<TrackSchema>({
      url: `tracks/${urn}/related`,
      addLinkedPartitioning: true,
      paginatorId: `Paginator get_track_related: ${urn}`,
      params,
    });
  }

  async download(urn: string, destination: WriteStream | string) {
    this.logger?.info({
      message: "Download track",
      urn,
      destination: destination instanceof String ? destination : "stream",
    });

    const stream = await this.stream(urn, "http_mp3_128_url");
    const readable = Readable.fromWeb(stream);

    if (destination instanceof WriteStream) {
      await pipeline(readable, destination);
    } else {
      const filePath = path.resolve(destination);
      await pipeline(readable, createWriteStream(filePath));
    }
  }

  async stream(urn: string, streamType: keyof TrackLinks) {
    this.logger?.info({
      message: "Get track stream",
      urn,
      streamType,
    });

    const streamsUrl = new ApiUrl(`tracks/${urn}/streams`, config.apiUrl);

    const streamsLinks = await this.fetcher.fetch<TrackLinks>({
      automaticallyAuthorizeClient: true,
      input: streamsUrl,
    });

    const stream = await this.fetcher.fetch({
      automaticallyAuthorizeClient: true,
      returnRawBodyStream: true,
      input: streamsLinks[streamType],
    });

    return stream;
  }
}
