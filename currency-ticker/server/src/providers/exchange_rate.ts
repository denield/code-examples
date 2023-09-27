import currencyInfo from '../../../currencies.json'
import type { Currency } from '../../../shared/types/api/ExchangeRate'

export type CurrencyInfo = {
  [key in string]?: {
    timestamp: number
    base: Currency
    rates: {
      [key in Currency]: number
    }
  }
}

export function fetchExchangeRates(dateQueryString: string) {
  return new Promise<CurrencyInfo[keyof CurrencyInfo] | null>((resolve) => {
    const requestedData = (currencyInfo as CurrencyInfo)[dateQueryString]
    return resolve(requestedData ?? null)
  })
}
