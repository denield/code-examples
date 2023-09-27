/// <reference types="cypress" />

describe('Currency Ticker App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display title, date picker', () => {
    cy.contains('Currency Ticker App')
    cy.get('[data-testid="date-picker"]').should('exist')
    cy.get('[data-testid="date-picker"]').should('have.text', 'January 1, 2017')
  })

  it('should display a table with exchange rate data for the default selected day', () => {
    cy.get('.ag-header-cell-text').contains('Currency')
    cy.get('.ag-header-cell-text').contains('Rate')
    cy.get('.ag-header-cell-text').contains('% change')

    cy.get('.ag-theme-material').should('exist')
    cy.fixture('2017-01-01').then((expectedData) => {
      cy.get('.ag-theme-material')
        .getAgGridData()
        .then((tableData) =>
          cy.agGridValidateRowsSubset(tableData, expectedData),
        )
    })
  })

  it('should be able to change to another day which should also display the change differences', () => {
    cy.get('[data-testid="date-picker"]').click()
    cy.get('[aria-label="2 January 2017').click()

    cy.get('.ag-header-cell-text').contains('Currency')
    cy.get('.ag-header-cell-text').contains('Rate')
    cy.get('.ag-header-cell-text').contains('% change')

    cy.get('.ag-theme-material').should('exist')
    cy.fixture('2017-01-02').then((expectedData) => {
      cy.get('.ag-theme-material')
        .getAgGridData()
        .then((tableData) =>
          cy.agGridValidateRowsSubset(tableData, expectedData),
        )
    })
  })

  it('should display an error text if data is not available', () => {
    cy.get('[data-testid="date-picker"]').click()
    cy.get('[aria-label="16 January 2017').click()
    cy.contains('No data found for the selected day.').should('exist')
  })

  it('should be able to sort by currency', () => {
    cy.get('.ag-header-cell-text').contains('Currency').click()
    cy.get('.ag-theme-material')
      .getAgGridData()
      .then((tableData) =>
        cy.agGridValidateRowsSubset(tableData, [
          {
            Currency: 'AED',
            Rate: '3.672896',
            '% change': 'Not available',
          },
          {
            Currency: 'AFN',
            Rate: '66.9585',
            '% change': 'Not available',
          },
          {
            Currency: 'ALL',
            Rate: '128.298385',
            '% change': 'Not available',
          },
        ]),
      )
    cy.get('.ag-header-cell-text').contains('Currency').click()
    cy.get('.ag-theme-material')
      .getAgGridData()
      .then((tableData) =>
        cy.agGridValidateRowsSubset(tableData, [
          {
            Currency: 'ZWL',
            Rate: '322.322775',
            '% change': 'Not available',
          },
          {
            Currency: 'ZMW',
            Rate: '9.834678',
            '% change': 'Not available',
          },
          {
            Currency: 'ZMK',
            Rate: '5253.075255',
            '% change': 'Not available',
          },
        ]),
      )
  })

  it('should be able to sort by rate', () => {
    cy.get('.ag-header-cell-text').contains('Rate').click()
    cy.get('.ag-theme-material')
      .getAgGridData()
      .then((tableData) =>
        cy.agGridValidateRowsSubset(tableData, [
          {
            Currency: 'XAU',
            Rate: '0.00086813',
            '% change': 'Not available',
          },
          {
            Currency: 'BTC',
            Rate: '0.001002604265',
            '% change': 'Not available',
          },
          {
            Currency: 'XPT',
            Rate: '0.00110804',
            '% change': 'Not available',
          },
        ]),
      )
    cy.get('.ag-header-cell-text').contains('Rate').click()
    cy.get('.ag-theme-material')
      .getAgGridData()
      .then((tableData) =>
        cy.agGridValidateRowsSubset(tableData, [
          {
            Currency: 'IRR',
            Rate: '30073.9923',
            '% change': 'Not available',
          },
          {
            Currency: 'STD',
            Rate: '23283.400391',
            '% change': 'Not available',
          },
          {
            Currency: 'VND',
            Rate: '22792.5',
            '% change': 'Not available',
          },
        ]),
      )
  })

  it('should be able to sort by % change', () => {
    cy.get('[data-testid="date-picker"]').click()
    cy.get('[aria-label="2 January 2017').click()
    cy.get('.ag-header-cell-text').contains('Rate').click()
    cy.get('.ag-theme-material')
      .getAgGridData()
      .then((tableData) =>
        cy.agGridValidateRowsSubset(tableData, [
          {
            Currency: 'XAU',
            Rate: '0.00086936',
            '% change': '+0.14%',
          },
          {
            Currency: 'BTC',
            Rate: '0.000981356677',
            '% change': '-2.12%',
          },
          {
            Currency: 'XPT',
            Rate: '0.00110682',
            '% change': '-0.11%',
          },
        ]),
      )
    cy.get('.ag-header-cell-text').contains('Rate').click()
    cy.get('.ag-theme-material')
      .getAgGridData()
      .then((tableData) =>
        cy.agGridValidateRowsSubset(tableData, [
          {
            Currency: 'IRR',
            Rate: '30080.0077',
            '% change': '+0.02%',
          },
          {
            Currency: 'STD',
            Rate: '23355.75',
            '% change': '+0.31%',
          },
          {
            Currency: 'VND',
            Rate: '22792.5',
            '% change': '0',
          },
        ]),
      )
  })

  it('should display the smallest % change highlighted with red background', () => {
    cy.get('[data-testid="date-picker"]').click()
    cy.get('[aria-label="2 January 2017').click()
    cy.get('.ag-header-cell-text').contains('% change').click()
    cy.get('.ag-row-first').should(
      'have.css',
      'background-color',
      'rgb(244, 67, 54)',
    )
    cy.get('.ag-row-level-0')
      .not('.ag-row-first')
      .should('not.have.css', 'background-color', 'rgb(244, 67, 54)')
  })

  it('should display the biggest % change highlighted with green background', () => {
    cy.get('[data-testid="date-picker"]').click()
    cy.get('[aria-label="2 January 2017').click()
    cy.get('.ag-header-cell-text').contains('% change').click().click()
    cy.get('.ag-row-first').should(
      'have.css',
      'background-color',
      'rgb(67, 160, 71)',
    )
    cy.get('.ag-row-level-0')
      .not('.ag-row-first')
      .should('not.have.css', 'background-color', 'rgb(67, 160, 71)')
  })
})
