/**
 * Encodes client_id and client_secret according to the rules of SoundCloud API.
 * It means that clientId and clientSecret would be encoded as `${clientId}:${clientSecret}`.toString("base64").
 * See more at [Client Credentials Token Exchange Flow](https://developers.soundcloud.com/docs/api/guide#authentication)
 * @param clientId
 * @param clientSecret
 * @returns string where clientId and clientSecret are delimited by ':' and converted to base64
 */
export function encodeCredentials(clientId: string, clientSecret: string) {
  return Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
}
