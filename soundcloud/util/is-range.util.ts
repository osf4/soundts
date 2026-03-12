const rangeKeys: readonly string[] = ["from", "to"] as const;

/**
 * Checks if the provided object is a range
 * @param v object to be checked
 * @returns Returns true, if 'v' any is an object like { "from": 1, "to": 2 }
 */
export function isRange(v: any) {
  if (!(typeof v === "object")) {
    return false;
  }

  for (const key of Object.keys(v)) {
    if (!rangeKeys.includes(key)) {
      return false;
    }
  }

  return true;
}
