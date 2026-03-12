import { ResourceAccess } from "@/types/util";

export type GetUserTracksParams = {
  access?: ResourceAccess[];
  limit?: number;
};
