import express from "express";
import {json} from "body-parser";

import ResetRoutes from "./routes/reset";
import ChargeRoutes from "./routes/charges";

export function buildApp(): express.Application {
    const app = express();
    app.use(json());

    ResetRoutes(app);
    ChargeRoutes(app);

    return app;
}
