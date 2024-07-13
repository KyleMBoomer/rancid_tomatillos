describe('Dropdown Component', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://rancid-tomatillos.herokuapp.com/api/v2/movies', { fixture: 'movies.json' }).as('getMovies')
    cy.intercept('GET', 'https://rancid-tomatillos.herokuapp.com/api/v2/movies/*', (req) => {
      const movieId = req.url.split('/').pop()
      const movieDetails = require('../fixtures/movieDetails.json')
      req.reply({ body: movieDetails[movieId] })
    }).as('getMovieDetails')
    cy.visit('http://localhost:3000/')
  })

  it('should render the dropdown with all genres', () => {
    cy.get('#genre-dropdown').should('be.visible')
    cy.get('#genre-dropdown').children('option').should('have.length', 8)
    cy.get('#genre-dropdown option').each(($el, index, $list) => {
      const genres = [
        'All Genres',
        'Action',
        'Fantasy',
        'Science Fiction',
        'Drama',
        'Horror',
        'Comedy',
        'Family'
      ]
      cy.wrap($el).should('contain.text', genres[index])
    })
  })

  it('should default to "All Genres" selection', () => {
    cy.get('#genre-dropdown').should('have.value', '')
  })

  // it('should filter movies by selected genre', () => {
  //   cy.wait('@getMovies');
  //   cy.get('#genre-dropdown').should('be.visible').select('Action')
  //   cy.wait('@getMovieDetails');
  //   cy.get('.movie-list', {timeout: 5000}).should('be.visible');
  //   cy.get('.movie-cards', {timeout: 5000}).should('have.length.at.least', 1);
  //   cy.get('.movie-cards').first().contains('Black Adam');
  // })
})

