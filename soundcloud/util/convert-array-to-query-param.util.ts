/**
 * Converts a JavaScript array to a string like: 1,2,3,4
 * @param values array for convertion
 * @param delimiter delimiter for the values
 * @returns string where all the values are separated from each other
 */
export function convertArrayToQueryParam(
  values: (any | undefined)[],
  delimiter = ",",
) {
  return values.join(delimiter);
}
