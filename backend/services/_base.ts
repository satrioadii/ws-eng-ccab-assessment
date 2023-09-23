import {ConnectToRedis, DefaultRedisClientType} from "../connections/redis/redis";


export default class BaseService {
  serviceContext: string;
  redisUrl: string;
  redisClient?: DefaultRedisClientType;

  constructor(serviceContext: string, url: string) {
    this.serviceContext = serviceContext;
    this.redisUrl = url;

    this.InitRedisConnection();
  }

  private async InitRedisConnection()  {
    this.redisClient = await ConnectToRedis(this.redisUrl);
  }
}
