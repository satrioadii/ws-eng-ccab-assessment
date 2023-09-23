import {createClient} from "redis";
import {ConnectToRedis} from "../connections/redis";


export default class BaseService {
  serviceContext: string;
  redisUrl: string;
  redisClient?: ReturnType<typeof createClient>;

  constructor(serviceContext: string, url: string) {
    this.serviceContext = serviceContext;
    this.redisUrl = url;

    this.ConnectToRedis();
  }

  private async ConnectToRedis()  {
    this.redisClient = await ConnectToRedis(this.redisUrl);
  }
}
