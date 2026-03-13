import { ApiFetcher } from "../api-fetcher";
import config from "../config";
import type { BaseLogger } from "../logger";
import { ApiUrl } from "../models";
import { Paginator } from "../paginator";
import type { Collection, UserSchema } from "../types/schemas";

type Endpoint = "tracks" | "users" | "playlists";

interface BaseSearchOptions {
  endpoint: Endpoint;
  params?: { q: string };
  paginatorId: string;
}

interface BaseGetByUrnOptions {
  endpoint: Endpoint;
  params?: any;
  urn: string;
}

interface BaseGetRepostersOptions {
  endpoint: Endpoint;
  params?: any;
  paginatorId: string;
  urn: string;
}

interface BaseGetCollectionOptions {
  url: string;
  params?: any;
  paginatorId: string;
  addLinkedPartitioning: boolean;
}

/**
 * Represents module that provides base methods such as baseSearch, baseGetByUrn that are same for all modules
 */
export class BaseModule {
  constructor(
    public readonly fetcher: ApiFetcher,
    public readonly logger?: BaseLogger,
  ) {}

  protected async baseSearch<Schema>({
    endpoint,
    params,
    paginatorId,
  }: BaseSearchOptions) {
    return await this.baseGetCollection<Schema>({
      url: endpoint,
      addLinkedPartitioning: true,
      paginatorId,
      params,
    });
  }

  protected async baseGetReposters({
    endpoint,
    params,
    urn,
    paginatorId,
  }: BaseGetRepostersOptions) {
    return await this.baseGetCollection<UserSchema>({
      url: `${endpoint}/${urn}/reposters`,
      addLinkedPartitioning: false,
      params,
      paginatorId,
    });
  }

  protected async baseGetByUrn<Schema>({
    endpoint,
    params,
    urn,
  }: BaseGetByUrnOptions) {
    const apiUrl = new ApiUrl(
      `${endpoint}/${encodeURIComponent(urn)}`,
      config.apiUrl,
    );

    apiUrl.initializeQueryParams(params);

    return await this.fetcher.fetch<Schema>({
      automaticallyAuthorizeClient: true,
      input: apiUrl,
    });
  }

  protected async baseGetCollection<Schema>({
    url,
    params,
    paginatorId,
    addLinkedPartitioning,
  }: BaseGetCollectionOptions) {
    const apiUrl = new ApiUrl(url, config.apiUrl);

    if (addLinkedPartitioning) {
      apiUrl.initializeQueryParams({
        linked_partitioning: "true",
        ...params,
      });
    } else {
      apiUrl.initializeQueryParams(params);
    }

    const page = await this.fetcher.fetch<Collection<Schema>>({
      automaticallyAuthorizeClient: true,
      input: apiUrl,
    });

    return new Paginator({
      id: paginatorId,
      fetcher: this.fetcher,
      page,
      logger: this.logger?.child({ scope: paginatorId }),
    });
  }
}
