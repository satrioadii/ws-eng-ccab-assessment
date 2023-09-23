import {Express} from 'express'

import ChargeService from "../../services/ChargeService";


const ResetRoutes = (app: Express) => {
  const service = {
    charge: new ChargeService()
  }

  app.post('/reset', async (req, res) => {
    try {
      const account = req.body.account ?? 'account';
      await service.charge.reset(account);

      console.log(`Successfully reset account: ${account}`);

      res.sendStatus(204);
    } catch (e) {
      console.error("Error while resetting account", e);
      res.status(500).json({ error: String(e) });
    }
  });
}

export default ResetRoutes;
