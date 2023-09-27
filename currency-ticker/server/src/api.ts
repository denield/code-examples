import express, { Request, Response } from 'express'
import exchangeRate from './routes/exchange_rate'
import healtz from './routes/healthz'

const apiRouter = express.Router()

apiRouter.get('/exchange_rate', exchangeRate)
apiRouter.get('/healthz', healtz)

export { apiRouter }
