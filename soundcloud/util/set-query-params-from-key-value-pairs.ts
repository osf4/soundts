/**
 * Takes all the pairs from 'pairs' object and appends it to query params of the url
 * @param url url where query params will be added to
 * @param pairs pairs of values which will be added to the url
 */
export function setQueryParamsFromKeyValuePairs(
  url: URL,
  pairs: Record<string, string>,
) {
  for (const [name, value] of Object.entries(pairs)) {
    url.searchParams.set(name, value);
  }
}
