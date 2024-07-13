describe('Glide Component', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://rancid-tomatillos.herokuapp.com/api/v2/movies', { fixture: 'movies.json' }).as('getMovies')
    cy.intercept('GET', 'https://rancid-tomatillos.herokuapp.com/api/v2/movies/*', (req) => {
      const movieId = req.url.split('/').pop()
      const movieDetails = require('../fixtures/movieDetails.json')
      req.reply({ body: movieDetails[movieId] })
    }).as('getMovieDetails')
    cy.visit('http://localhost:3000/')
  })

  it('renders the Glide component after selecting a genre', () => {

    cy.get('.genre-dropdown').select('Action');
    cy.get('.glide').should('exist');
  });

  it('navigates through slides after selecting a genre', () => {
    // Select a genre in the dropdown
    cy.get('.genre-dropdown').select('Action');
    cy.get('.glide__arrow--right').click()
    cy.wait(500)
    cy.get('.glide__arrow--left').click()
  });

  // it('handles movie clicks correctly after selecting a genre', () => {
  //   cy.get('.genre-dropdown').select('Action')
  //   cy.get('.glide__slide').first().click()
  //   cy.url().should('include', '/movies/')
  // });

  // it('updates the Glide component with new movies after selecting a genre', () => {

  //   cy.get('.genre-dropdown').select('Action')
  //   cy.get('.glide').should('exist').then(($glide) => {
  //     cy.wrap($glide).invoke('prop', 'movies', [
  //       { id: 1, title: 'New Movie 1' },
  //       { id: 2, title: 'New Movie 2' }
  //     ]);

  //     cy.wait(1000);
  //     cy.get('.glide__slide').should('have.length', 2);
  //   });
  // });

  it('destroys the Glide component when unmounted or genre is switched', () => {

    cy.get('.genre-dropdown').select('Action')
    cy.get('.genre-dropdown').select('')

  });
});
