import styled from '@emotion/styled'
import { AgGridReact } from 'ag-grid-react'
import type { ExchangeRateAnswer } from '../../../../shared/types/api/ExchangeRate'
import { useMemo } from 'react'
import { ColDef } from 'ag-grid-community'

const Container = styled.div`
  height: 500px;
`

const CurrenciesTable: React.FC<{
  rowData: NonNullable<ExchangeRateAnswer>['rates']
}> = ({ rowData }) => {
  const highestLossCurrency = rowData.reduce(
    (acc, { currency, diff }) => {
      return typeof diff === 'number' && diff < acc.min
        ? { min: diff, currency }
        : acc
    },
    { min: 0, currency: null } as {
      min: number
      currency: (typeof rowData)[number]['currency'] | null
    },
  ).currency

  const highestGainCurrency = rowData.reduce(
    (acc, { currency, diff }) => {
      return typeof diff === 'number' && diff > acc.max
        ? { max: diff, currency }
        : acc
    },
    { max: 0, currency: null } as {
      max: number
      currency: (typeof rowData)[number]['currency'] | null
    },
  ).currency

  const columnDefs: ColDef<(typeof rowData)[number]>[] = useMemo(
    () => [
      {
        headerName: 'Currency',
        field: 'currency',
      },
      {
        headerName: 'Rate',
        field: 'rate',
      },
      {
        headerName: '% change',
        field: 'diff',
        valueFormatter: ({ value: diff }) => {
          if (diff === null) {
            return 'Not available'
          }
          if (diff === 0) {
            return '0'
          }
          return `${diff >= 0 ? '+' : ''}${diff}%`
        },
      },
    ],
    [],
  )

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    [],
  )

  return (
    <Container>
      <AgGridReact
        className="ag-theme-material"
        animateRows={true}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={rowData}
        suppressRowHoverHighlight={true}
        gridOptions={{
          getRowStyle: (params) => {
            const currency = params.data?.currency

            if (currency === highestLossCurrency) {
              return { backgroundColor: '#F44336', color: 'white' }
            } else if (currency === highestGainCurrency) {
              return { backgroundColor: '#43A047', color: 'white' }
            }
          },
        }}
      />
    </Container>
  )
}

export default CurrenciesTable
