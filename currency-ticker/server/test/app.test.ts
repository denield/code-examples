import request from 'supertest'
import { when } from 'jest-when'
import { app } from '../src/app'
import { fetchExchangeRates } from '../src/providers/exchange_rate'
import { Currency } from '../../shared/types/api/ExchangeRate'
import currencyInfo from '../../currencies.json'

const MOCKED_CURRENCIES = {
  '2023-01-01': {
    base: 'GBP' as Currency,
    timestamp: 1672531200,
    rates: {
      ...currencyInfo['2017-01-01'].rates,
      EUR: 1.15,
      USD: 1.21,
      HUF: 450,
    },
  },
  '2023-01-02': {
    base: 'GBP' as Currency,
    timestamp: 1672617600,
    rates: {
      ...currencyInfo['2017-01-01'].rates,
      EUR: 1.13,
      USD: 1.2,
      HUF: 450,
    },
  },
}

jest.mock('../src/providers/exchange_rate')

const mockedFetchExchangeRates = jest.mocked(fetchExchangeRates)

describe('GET /random-url', () => {
  it('should return 400', async () => {
    await request(app).get('/reset').expect(404)
  })
})

describe('GET /exchange_rate', () => {
  beforeEach(() => {
    const day1 = '2023-01-01'
    const day2 = '2023-01-02'
    mockedFetchExchangeRates.mockClear()
    when(mockedFetchExchangeRates)
      .calledWith(day1)
      .mockResolvedValue(MOCKED_CURRENCIES[day1])
    when(mockedFetchExchangeRates)
      .calledWith(day2)
      .mockResolvedValue(MOCKED_CURRENCIES[day2])
  })

  it('should return 400 when no date param provided', async () => {
    await request(app).get('/api/exchange_rate').expect(400)
  })

  it('should return 400 when the date query parameter is mailformed', async () => {
    await request(app).get('/api/exchange_rate?date=2017-01-00').expect(400)
    await request(app).get('/api/exchange_rate?date=2017-02-31').expect(400)
    await request(app).get('/api/exchange_rate?date=199-01-01').expect(400)
    await request(app).get('/api/exchange_rate?date=199-01-03').expect(400)
    await request(app).get('/api/exchange_rate?date=01/01/2017').expect(400)
  })

  it('should return 404 when no data is available for a date', async () => {
    await request(app).get('/api/exchange_rate?date=2016-12-31').expect(404)
  })

  it('should return with the expected data for the first date available (no diff)', async () => {
    expect(mockedFetchExchangeRates).not.toBeCalled()
    const response = await request(app).get(
      '/api/exchange_rate?date=2023-01-01',
    )
    expect(mockedFetchExchangeRates).toBeCalledTimes(2)
    expect(mockedFetchExchangeRates).toBeCalledWith('2023-01-01')
    expect(mockedFetchExchangeRates).toBeCalledWith('2022-12-31')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      date: '2023-01-01',
      base: 'GBP',
    })
    expect(response.body.rates).toEqual(
      expect.arrayContaining([
        { currency: 'EUR', rate: 1.15, diff: null },
        { currency: 'USD', rate: 1.21, diff: null },
        { currency: 'HUF', rate: 450, diff: null },
      ]),
    )
  })
  it('should return with the expected data for any available date with prior data (with diff)', async () => {
    expect(mockedFetchExchangeRates).not.toBeCalled()
    const response = await request(app).get(
      '/api/exchange_rate?date=2023-01-02',
    )
    expect(mockedFetchExchangeRates).toBeCalledTimes(2)
    expect(mockedFetchExchangeRates).toBeCalledWith('2023-01-01')
    expect(mockedFetchExchangeRates).toBeCalledWith('2023-01-02')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      date: '2023-01-02',
      base: 'GBP',
    })
    expect(response.body.rates).toEqual(
      expect.arrayContaining([
        { currency: 'EUR', rate: 1.13, diff: -1.74 },
        { currency: 'USD', rate: 1.2, diff: -0.83 },
        { currency: 'HUF', rate: 450, diff: 0 },
      ]),
    )
  })
})

describe('GET /healthz', () => {
  it('should return HTTP 200 with "healthy"', async () => {
    const response = await request(app)
      .get('/api/healthz')
      .set('accept', 'application/json')
      .expect(200)
    expect(response.body).toEqual({ health: 'ok' })
  })
})
