export type CommentSchema = {
  kind: "comment";
  id: number;
  urn: string;
  body: string;
  created_at: string;
  timestamp: number;
  track_id: number;
  track_urn: string;
  user_id: number;
  user_urn: string;
  user: {
    kind: "user";
    urn: string;
    permalink: string;
    username: string;
    last_modified: string;
    uri: string;
    permalink_url: string;
    avatar_url: string;
    followers_count: number;
    followings_count: number;
    reposts_count: number;
  };
};
