import React from 'react'
import CurrenciesTable from './CurrenciesTable'

describe('<CurrenciesTable />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CurrenciesTable />)
  })
})