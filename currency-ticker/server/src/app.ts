import express from 'express'
import { apiRouter } from './api'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const app = express()

app.use(express.json())
app.use('/api', apiRouter)

export { app }
