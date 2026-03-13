import { createWriteStream } from "fs";
import { Soundcloud, SoundcloudCredentials } from "soundts";
import { pipeline } from "stream/promises";

async function bootstrap() {
  const sc = new Soundcloud({
    credentials: new SoundcloudCredentials({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  });

  const trackStream = await sc.tracks.stream(
    "soundcloud:tracks:441699126",
    "http_mp3_128_url",
  );

  const output = createWriteStream("6000000000себя.mp3");
  await pipeline(trackStream, output);

  await sc.tracks.download(
    "soundcloud:tracks:441699126",
    "не6000000000себя.mp3",
  );
}
bootstrap();
