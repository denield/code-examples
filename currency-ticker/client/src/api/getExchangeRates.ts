import axios from 'axios'
import { ExchangeRateAnswer } from '../../../shared/types/api/ExchangeRate'

export async function getExchangeRates(date: string) {
  const response = await axios.get<ExchangeRateAnswer>('/api/exchange_rate', {
    params: { date },
  })
  return response.data
}
