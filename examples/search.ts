import { Soundcloud, SoundcloudCredentials } from "soundts";

async function bootstrap() {
  const sc = new Soundcloud({
    credentials: new SoundcloudCredentials({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  });

  const tracksPaginator = await sc.tracks.search({
    q: "Wamentirele",
    limit: 2,
    access: ["playable"],
  });

  tracksPaginator.collection.forEach((track) =>
    console.log(`${track.user?.username} - ${track.title}`),
  );

  const playlistsPaginator = await sc.playlists.search({
    q: "DSBM",
    limit: 2,
    access: ["playable"],
  });

  playlistsPaginator.collection.forEach((playlist) =>
    console.log(`${playlist.user?.username} - ${playlist.title}`),
  );

  const usersPaginator = await sc.users.search({
    q: "User with good username",
    limit: 2,
  });

  usersPaginator.collection.forEach((user) => console.log(user.username));
}
bootstrap();
