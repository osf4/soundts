import type { ResourceAccess } from "../../util";

export type GetTrackRelatedParams = {
  access?: ResourceAccess[];
  limit?: number;
};
