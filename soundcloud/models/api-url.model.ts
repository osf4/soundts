import {
  convertMethodParamsToKeyValuePairs,
  setQueryParamsFromKeyValuePairs,
} from "@/util";

/**
 * Represents ApiUrl and provides a convenient way to initialize query params through a single method
 * @extends {URL}
 */
export class ApiUrl extends URL {
  initializeQueryParams<T extends object>(params?: T) {
    const pairs = convertMethodParamsToKeyValuePairs(params);
    setQueryParamsFromKeyValuePairs(this, pairs);
  }
}
