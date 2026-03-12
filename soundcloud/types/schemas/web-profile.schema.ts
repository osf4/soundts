export type WebProfileSchema = {
  kind: "web-profile";
  created_at: string;
  id: number;
  urn: string;
  service: string;
  title: string;
  url: string;
  username: string;
};
