import type { ResourceAccess } from "../../util";

export type GetUserPlaylistsParams = {
  access?: ResourceAccess[];
  show_tracks?: boolean;
  limit?: number;
};
