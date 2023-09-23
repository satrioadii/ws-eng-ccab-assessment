import express from "express";
import {json} from "body-parser";

import {ConnectToRedis} from "./connections/redis/redis";
import ResetRoutes from "./routes/reset";
import ChargeRoutes from "./routes/charges";

export async function buildApp(): Promise<express.Application> {
    await ConnectToRedis(`redis://${process.env.REDIS_HOST ?? "localhost"}:${process.env.REDIS_PORT ?? "6379"}`);

    const app = express();
    app.use(json());

    ResetRoutes(app);
    ChargeRoutes(app);

    return app;
}
