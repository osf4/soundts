import type { ResourceAccess } from "../../util";

export type GetPlaylistByUrnParams = {
  secret_token?: string;
  access?: ResourceAccess[];
  show_tracks?: boolean;
};
