# About

**soundcloudts** is a small library for accessing SoundCloud API written in pure TypeScript and has **zero dependencies**.

# Install

```ts
npm install soundcloudts
```

# Authorization

To get access to SoundCloud API follow the steps below:

- Open the [page of creating a new application](https://soundcloud.com/you/apps/new)
- Fill the form and get back to [your applications](https://soundcloud.com/you/apps/)
- Save **Client ID** and **Client Secret**

So, **Client ID** and **Client Secret** are your credentials for authorization.

# API Documentation

- [OpenAPI](https://developers.soundcloud.com/docs/api/explorer/open-api#)
- [Developers guide](https://developers.soundcloud.com/docs/api/guide)

# Examples

**Search for tracks, playlists, and users**

```ts
import { SoundcloudCredentials } from "@/models";
import { Soundcloud } from "@/soundcloud";

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
```

**Get track, user or playlist by it's urn**

```ts
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
```

**Get stream of track or download it**

```ts
import { SoundcloudCredentials } from "@/models";
import { Soundcloud } from "@/soundcloud";
import { createWriteStream } from "fs";
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
```

**Save and load credentials**

```ts
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
```
