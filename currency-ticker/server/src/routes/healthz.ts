import { Request, Response } from 'express'

export default (_: Request, res: Response) => {
  res.json({ health: 'ok' })
}
