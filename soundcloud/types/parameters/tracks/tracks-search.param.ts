import { Range, ResourceAccess } from "@/types/util";

export type TracksSearchParams = {
  q: string;
  ids?: number[];
  urns?: string[];
  genres?: string[];
  tags?: string[];
  bpm?: Range;
  duration?: Range;
  created_at?: Range;
  access?: ResourceAccess[];
  limit?: number;
};
