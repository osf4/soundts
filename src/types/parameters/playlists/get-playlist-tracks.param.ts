import type { ResourceAccess } from "../../util";

export type GetPlaylistTracksParams = {
  secret_token?: string;
  access?: ResourceAccess[];
};
