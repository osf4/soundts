/**
 * Converts response body to JavaScript object
 * @param response server response
 * @returns JavaScript object from converted 'response.body'
 */
export async function getJson<T = any>(response: Response): Promise<T> {
  const data = await response.json();
  return data as T;
}
