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
      const result = await this.redisClient?.library_charge?.charge(`${account}/balance`, charges);

      if (result === undefined || result === 'false') {
        return { isAuthorized: false }
      }

      const [status, balance] = result.split(":");

      if (status === 'true' && parseFloat(balance) >= 0) {
        return { isAuthorized: true, remainingBalance: balance, charges };
      }

      return { isAuthorized: true, remainingBalance: balance, charges: charges}
  }
}
