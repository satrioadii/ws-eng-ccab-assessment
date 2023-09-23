import BaseService from "./_base";

export default class ChargeService extends BaseService {
  private DEFAULT_BALANCE = 100;

  constructor() {
    super(
      "ChargeService",
      `redis://${process.env.REDIS_HOST ?? "localhost"}:${process.env.REDIS_PORT ?? "6379"}`
    );
  }

  async reset(account: string): Promise<void> {
      await this.redisClient?.set(`${account}/balance`, this.DEFAULT_BALANCE);
  }

  async charge(account: string, charges: number) {
      const balance = parseInt((await this.redisClient?.get(`${account}/balance`)) ?? "");
      if (balance >= charges) {
        await this.redisClient?.set(`${account}/balance`, balance - charges);
        const remainingBalance = parseInt((await this.redisClient?.get(`${account}/balance`)) ?? "");
        return { isAuthorized: true, remainingBalance, charges };
      } else {
        return { isAuthorized: false, remainingBalance: balance, charges: 0 };
      }
  }
}
