import { ResourceAccess } from "@/types/util";

export type GetPlaylistTracksParams = {
  secret_token?: string;
  access?: ResourceAccess[];
};
