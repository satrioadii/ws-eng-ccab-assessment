import {Express} from 'express'

import AllServices from "../../services/_index";

const service = {
  charge: AllServices.charge,
}

const ChargeRoutes = (app: Express) => {
  app.post('/charge', async (req, res) => {
    try {
      const account = req.body.account ?? 'account';
      const result = await service.charge.charge(account, req.body.charges ? parseFloat(req.body.charges) : 10);

      console.log(`Successfully charged account: ${account}`);

      res.status(200).json(result);
    } catch (e) {
      console.error("Error while charging account", e);
      res.status(500).json({ error: String(e) });
    }
  });
}

export default ChargeRoutes;
