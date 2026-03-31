import { createReadStream } from "fs";
import { Soundcloud, SoundcloudCredentials } from "soundts";

async function bootstrap() {
  const sc = new Soundcloud({
    credentials: new SoundcloudCredentials({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  });

  await sc.signIn();
  console.log(sc.credentials);

  const credentialsDump = sc.credentials.dump();

  try {
    const credentials = SoundcloudCredentials.load(credentialsDump);

    console.log(credentials);
  } catch (error) {
    console.error("Unable to load credentials from soundcloud.auth: ", error);
  }
}
bootstrap();
