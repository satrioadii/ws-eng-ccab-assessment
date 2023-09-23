import {createClient, RedisClientType} from "redis";
import fs from "fs";

export type DefaultRedisClientType = RedisClientType<{
}, {
  library_charge: {
    charge: {
      NUMBER_OF_KEYS: 1;
      transformArguments(key: string, toCharge: number): Array<string>;
      transformReply(reply: string): string;
    };
  };
}, {}>;

export interface RedisClientCache {
  [key: string]: DefaultRedisClientType;
}

export const clientCache: RedisClientCache = {
}

export const ConnectToRedis = async (url: string):  Promise<DefaultRedisClientType>  => {
  if (clientCache?.[url]?.isReady) {
    console.log(`Using cached redis client for ${url}`);
    return clientCache[url];
  }

  console.log(`Using redis URL ${url}`);

  const client = createClient({
    url,
    functions: {
      library_charge: {
        charge: {
          NUMBER_OF_KEYS: 1,
          transformArguments(key: string, toAdd: number): Array<string> {
            return [key, toAdd.toString()];
          },
          transformReply(reply: string): string {
            return reply;
          }
        }
      }
    }
  });

  clientCache[url] = client as DefaultRedisClientType;

  await client.connect();

  let libraryNamesToImplement = ['library_charge'];
  const chargeScriptsPath = {
    'library_charge':  __dirname + '/functions/charge.lua'
  }

  const functionList = await client.FUNCTION_LIST();
  for (let i = 0; i < functionList.length; i++) {
    const functionName = functionList[i].libraryName;

    if (libraryNamesToImplement.includes(functionName)) {
      libraryNamesToImplement = libraryNamesToImplement.filter((name) => name !== functionName);
    }
  }

  if (libraryNamesToImplement.length > 0) {
    console.log(`Implementing ${libraryNamesToImplement.length} lua libraries`);

    for (let i = 0; i < libraryNamesToImplement.length; i++) {
      const libraryName = libraryNamesToImplement[i];

      const libraryScripts: string = (chargeScriptsPath as any)?.[libraryName] as string;

      if (libraryScripts?.length > 0) {
        const libraryScripts = fs.readFileSync(__dirname + '/functions/charge.lua').toString();
        await client.FUNCTION_LOAD(libraryScripts)

        console.log(`Loaded ${libraryName} lua library`);
      }
    }
  }


  return client as DefaultRedisClientType;
}
