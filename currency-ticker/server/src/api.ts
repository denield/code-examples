import express, { Request, Response } from 'express';

const apiRouter = express.Router();

apiRouter.get('/healthz', (req: Request, res: Response) => {
  res.json({health: 'ok'});
});

export { apiRouter };
