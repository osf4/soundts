import { SoundcloudCredentials } from "@/models";
import { Soundcloud } from "@/soundcloud";

async function bootstrap() {
  const sc = new Soundcloud({
    credentials: new SoundcloudCredentials({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  });

  const track = await sc.tracks.getByUrn("soundcloud:tracks:1015448728");
  console.log(track.title);

  const user = await sc.users.getByUrn("soundcloud:users:948745750");
  console.log(user.username);

  const playlist = await sc.playlists.getByUrn(
    "soundcloud:playlists:1212781357",
  );
  console.log(playlist.title);
}
bootstrap();
