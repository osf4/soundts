import { CommentSchema, PlaylistSchema, TrackSchema, UserSchema } from "./";

export type Collection<T = any> = {
  collection: T[];
  next_href: string | null;
};

export type TracksCollection = Collection<TrackSchema>;
export type UsersCollection = Collection<UserSchema>;
export type PlaylistsCollection = Collection<PlaylistSchema>;
export type CommentsCollection = Collection<CommentSchema>;
