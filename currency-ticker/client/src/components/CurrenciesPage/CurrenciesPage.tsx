import { useState } from 'react'
import { DatePickerInput } from '@mantine/dates'
import { Center, LoadingOverlay, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import CurrenciesTable from '../CurrenciesTable/CurrenciesTable'
import { useQuery } from '@tanstack/react-query'
import { getExchangeRates } from '../../api/getExchangeRates'
import styled from '@emotion/styled'

const ContentContainer = styled.div`
  margin: 0 auto;
  height: 400px;
  width: 100%;

  @media (min-width: 650px) {
    width: 620px;
  }
`

const OverlayContainer = styled.div`
  position: relative;
  margin-top: 20px;
  min-width: 200px;
  min-height: 200px;
`

export default function CurrenciesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date('2017-01-01'),
  )
  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD')
  const { data, error, isLoading } = useQuery(
    ['exchange_rate', formattedDate],
    () => {
      if (selectedDate) {
        return getExchangeRates(formattedDate)
      }
    },
    { retry: false },
  )

  return (
    <ContentContainer>
      <Center>
        <Title order={1} p="md">
          Currency Ticker App
        </Title>
      </Center>
      <DatePickerInput
        data-testid="date-picker"
        aria-label="Pick date"
        value={selectedDate}
        onChange={setSelectedDate}
        mx="auto"
        maw={400}
      />
      {error ? (
        <Text fz="lg">No data found for the selected day.</Text>
      ) : (
        <OverlayContainer>
          <LoadingOverlay visible={isLoading} overlayBlur={2} zIndex={1} />
          {data && <CurrenciesTable rowData={data.rates} />}
        </OverlayContainer>
      )}
    </ContentContainer>
  )
}
