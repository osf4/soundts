import { convertArrayToQueryParam } from "@/util/convert-array-to-query-param.util";
import { convertRangeToQueryParam } from "@/util/convert-range-to-query-param.util";
import { isRange } from "@/util/is-range.util";

/**
 * Converts object into a dictionary according to the rules of SoundCloud API.
 * A range -> range_name[from]=value,range_name[to]=value.
 * An array -> array_name=1,2,3,4,5
 * An object -> first_element=value,second_element=value.
 * A plain value -> value_name=value.
 * For example,
 * {
 *  q: "cool tracks",
 *  duration: { from: 1, to: 2},
 *  access: ["playable", "blocked", "preview"]
 * }
 * would be converted as ---->
 * {
 *  q: "cool tracks",
 *  "duration[from]": 1,
 *  "duration[to]: 2",
 *  access="playable,blocked,preview"
 * }
 * @param params values for convertion
 * @returns dictionary which contains converted names and values
 */
export function convertMethodParamsToKeyValuePairs<T extends object>(
  params?: T,
) {
  if (!params) {
    return {};
  }

  const result: Record<string, string> = {};

  for (const [name, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      result[name] = convertArrayToQueryParam(value);

      continue;
    }

    if (isRange(value)) {
      const range = convertRangeToQueryParam(name, value);

      result[range.from?.name] = range.from?.value;
      result[range.to?.name] = range.to?.value;

      continue;
    }

    result[name] = String(value);
  }

  return result;
}
