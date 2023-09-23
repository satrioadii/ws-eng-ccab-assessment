import {createClient} from "redis";

export interface RedisClientCache {
  [key: string]: ReturnType<typeof createClient>;
}

export const clientCache: RedisClientCache = {
}

export const ConnectToRedis = async (url: string):  Promise<ReturnType<typeof createClient>>  => {
  if (clientCache?.[url]?.isReady) {
    console.log(`Using cached redis client for ${url}`);
    return clientCache[url];
  }

  console.log(`Using redis URL ${url}`);

  const client = createClient({ url });
  await client.connect();

  clientCache[url] = client;
  return client;
}
