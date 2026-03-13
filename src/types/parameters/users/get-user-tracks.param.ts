import type { ResourceAccess } from "../../util";

export type GetUserTracksParams = {
  access?: ResourceAccess[];
  limit?: number;
};
