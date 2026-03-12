import { ResourceAccess } from "@/types/util";

export type GetUserPlaylistsParams = {
  access?: ResourceAccess[];
  show_tracks?: boolean;
  limit?: number;
};
