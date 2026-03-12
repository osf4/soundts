import { SoundcloudCredentials } from "@/models";
import { Soundcloud } from "@/soundcloud";
import { createReadStream } from "fs";

async function bootstrap() {
  const sc = new Soundcloud({
    credentials: new SoundcloudCredentials({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
    }),
  });

  await sc.signIn();
  console.log(sc.credentials);

  await sc.credentials.dump("soundcloud.auth");

  try {
    const credentialsStream = createReadStream("soundcloud.auth");
    const credentials = SoundcloudCredentials.load(credentialsStream);

    console.log(credentials);
  } catch (error) {
    console.error("Unable to load credentials from soundcloud.auth: ", error);
  }
}
bootstrap();
