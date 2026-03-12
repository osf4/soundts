import { ResourceAccess } from "@/types/util";

export type GetTrackRelatedParams = {
  access?: ResourceAccess[];
  limit?: number;
};
