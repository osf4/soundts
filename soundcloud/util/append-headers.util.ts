/**
 * Takes headers from 'init' and appends new headers
 * @param init RequestInit which contains the original headers
 * @param headers new headers to append to the init
 * @returns new header dictionary which contains original and new headers
 */
export function appendHeaders(
  init: RequestInit | undefined,
  headers: Record<string, string>,
): RequestInit {
  const requestHeaders = new Headers(init?.headers);

  for (const [name, value] of Object.entries(headers)) {
    requestHeaders.append(name, value);
  }

  return { ...init, headers: requestHeaders };
}
