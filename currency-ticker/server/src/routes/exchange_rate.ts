import { Request, Response } from 'express'
import dayjs from 'dayjs'
import { differenceInPercentage } from '../utils/math'
import { fetchExchangeRates } from '../providers/exchange_rate'
import type { Entries } from 'type-fest'
import type {
  Currency,
  ExchangeRateAnswer,
} from '../../../shared/types/api/ExchangeRate'

type CurrencyInfo = {
  [key in string]?: {
    timestamp: number
    base: Currency
    rates: {
      [key in Currency]: number
    }
  }
}

export default async (
  req: Request<{}, {}, {}, { date: string }>,
  res: Response<ExchangeRateAnswer>,
) => {
  const dateQueryString = req.query.date

  if (
    !dateQueryString ||
    !dayjs(dateQueryString, 'YYYY-MM-DD', true).isValid()
  ) {
    return res.status(400).send()
  }

  const prevDayQueryString = dayjs(dateQueryString)
    .subtract(1, 'days')
    .format('YYYY-MM-DD')

  const [queriedDayData, prevDayData] = await Promise.all([
    fetchExchangeRates(dateQueryString),
    fetchExchangeRates(prevDayQueryString),
  ])

  if (!queriedDayData) {
    return res.status(404).send()
  }

  const rates = (
    Object.entries(queriedDayData.rates) as Entries<
      NonNullable<CurrencyInfo[keyof CurrencyInfo]>['rates']
    >
  ).map(([currency, rate]) => ({ currency, rate }))

  const ratesWithDiff = rates.map(({ currency, rate }) => {
    const previousRate = prevDayData?.rates[currency]
    const diff =
      previousRate !== undefined
        ? differenceInPercentage(rate, previousRate)
        : null
    return { currency, rate, diff }
  })

  const ratesWithDiffRounded = ratesWithDiff.map(
    ({ currency, rate, diff }) => ({
      currency,
      rate,
      diff: diff !== null ? parseFloat(diff.toFixed(2)) : null,
    }),
  )

  return res.json({
    date: dateQueryString,
    base: queriedDayData.base,
    rates: ratesWithDiffRounded,
  })
}
