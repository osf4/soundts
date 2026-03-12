import { ResourceAccess } from "@/types/util";

export type PlaylistsSearchParams = {
  q: string;
  access?: ResourceAccess[];
  show_tracks?: boolean;
  limit?: number;
};
