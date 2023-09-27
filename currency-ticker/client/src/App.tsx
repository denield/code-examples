import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-material.css'
import { MantineProvider, Container } from '@mantine/core'
import CurrenciesPage from './components/CurrenciesPage/CurrenciesPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Container size="lg">
          <CurrenciesPage />
        </Container>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default App
