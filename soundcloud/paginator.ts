import { ApiFetcher } from "@/api-fetcher";
import { LastPageError } from "@/error/last-page.error";
import { BaseLogger } from "@/logger";
import { Collection } from "@/types/schemas";

/**
 * Represents paginator options
 * @param id unique string to distinguish different paginators around the application
 * @param page provides 'collection' - an array of requested data (TrackSchema, UserSchema, PlaylistSchema) and 'next_href' - link to the next page
 * @param fetcher provides fetching of SoundCloud API for next pages
 * @param logger provides logging of SoundCloud API requests
 */
type PaginatorOptions<T> = {
  id: string;
  page: Collection<T>;
  fetcher: ApiFetcher;
  logger?: BaseLogger;
};

/**
 * Represents a page of data(Tracks, Users, Playlists) returned by SoundCloud API
 */
export class Paginator<T> implements AsyncIterable<T[]> {
  /**
   * Unique string to distinguish different paginators around the application
   */
  public readonly id: string;

  /**
   * Provides logging of SoundCloud API requests
   */
  public readonly logger?: BaseLogger;

  /**
   * Provides logging of SoundCloud API requests
   */
  private readonly fetcher: ApiFetcher;

  /**
   * Provides 'collection' - an array of requested data (TrackSchema, UserSchema, PlaylistSchema) and 'next_href' - link to the next page
   */
  private page: Collection<T>;

  constructor({ id, page, fetcher, logger }: PaginatorOptions<T>) {
    this.id = id;
    this.fetcher = fetcher;
    this.page = page;
    this.logger = logger;
  }

  async *[Symbol.asyncIterator](): AsyncIterableIterator<T[]> {
    let firstReturn = false;

    while (this.nextPageAvailable) {
      if (firstReturn) {
        firstReturn = false;
        yield this.collection;
      }

      const nextPage = await this.next();
      yield nextPage.collection;
    }
  }

  /**
   * Fetches the next page of data
   * @throws {LastPageError} in case when 'next' method is called, but the next page is not available (next_href == null)
   */
  async next() {
    if (!this.nextPageAvailable) {
      this.logger?.error({
        message: "Tried to fetch next page after the last one",
      });

      throw new LastPageError(
        `Paginator '${this.id}' does not have next page. Please, check 'nextPageAvailable' before calling 'next'`,
      );
    }

    this.logger?.info({
      message: "Fetch next page",
      url: this.page.next_href,
    });

    this.page = await this.fetcher.fetch<Collection<T>>({
      automaticallyAuthorizeClient: true,
      input: this.page.next_href!,
    });

    return this;
  }

  /**
   * Returns collection of data from the current page
   */
  get collection() {
    return this.page.collection;
  }

  /**
   * Returns true, if the next page is available (SoundCloud API returned a page with 'next_href' != null)
   */
  get nextPageAvailable() {
    return !!this.page.next_href;
  }
}
