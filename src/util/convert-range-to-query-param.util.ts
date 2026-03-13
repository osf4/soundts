import type { Range } from "../types/util";

/**
 * Converts a range according to the rules of SoundCloud API.
 * range -> baseName[from]=range.from, baseName=[to]=range.to
 * For example,
 * {
 *  from: 1,
 *  to: 2,
 * }
 * with baseName = "duration" would be ---->
 * {
 *  "duration[from]": 1,
 *  "duration[to]": 2,
 * }
 * @param baseName name of the range to be added as prefix
 * @param range range to be converted
 * @returns an object containing pairs of names and values for the range
 */
export function convertRangeToQueryParam(baseName: string, range: Range) {
  return {
    from: {
      name: `${baseName as string}[from]`,
      value: range.from.toString(),
    },
    to: {
      name: `${baseName as string}[to]`,
      value: range.to.toString(),
    },
  };
}
