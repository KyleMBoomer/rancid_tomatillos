describe('Movie Page', () => {
  let movieId = 436270;
  let movie;

  beforeEach(() => {
    cy.fixture('movieDetails').then((details) => {
      movie = details[movieId];

      cy.intercept('GET', `https://rancid-tomatillos.herokuapp.com/api/v2/movies/${movieId}`, {
        statusCode: 200,
        body: { movie },
      }).as('getMovie');

      cy.visit(`http://localhost:3000/movies/${movieId}`);
    });
  });

  it('should display the movie details when the page loads', () => {
    cy.wait('@getMovie');
    cy.get('.movie-title').should('contain.text', movie.title);
    cy.get('.movie-rating').should('contain.text', `⭐️ ${movie.average_rating.toFixed(2)}`);
    cy.get('.movie-released').should('contain.text', `Released: ${movie.release_date}`);
    cy.get('.genre').should('contain.text', `Genre: ${movie.genres.join(', ')}`);
    cy.get('.overview').within(() => {
      cy.get('p').first().should('contain.text', `Overview: ${movie.overview}`);
      cy.get('p').eq(1).should('contain.text', `Movie Length: ${movie.runtime} min.`);
      cy.get('p').eq(2).should('contain.text', `Budget: $${movie.budget.toLocaleString()}`);
      cy.get('p').eq(3).should('contain.text', `Revenue: $${movie.revenue.toLocaleString()}`);
      cy.get('p').eq(4).should('contain.text', `Tagline: ${movie.tagline}`);
    });

    if (movie.trailer) {
      cy.get('.poster iframe')
        .should('have.attr', 'src')
        .and('include', `https://www.youtube.com/embed/${movie.trailer}`);
    }
  });

  it('should have a "Back to All Movies" button that navigates back to the main page', () => {
    cy.get('button').contains('Back to All Movies').should('be.visible');
    cy.get('button').contains('Back to All Movies').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });
});
