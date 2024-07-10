import { movieDetails } from '../support/mockData';

describe('Movie Page', () => {
  beforeEach(() => {
    cy.intercept('GET', `https://rancid-tomatillos.herokuapp.com/api/v2/movies/436270`, {
      statusCode: 200,
      body: { movie: movieDetails[436270] },
    }).as('getMovie');

    // Visit the specific movie page
    cy.visit('http://localhost:3000/movies/436270');
  });

  it('should display the movie details when the movie card is clicked', () => {
    const movie = movieDetails[436270]; // Using the movie ID from the initial visit

    cy.wait('@getMovie');

    // Simplified assertion for background image to not include gradient
    cy.get('.movie-detail')
      .should('have.css', 'background-image')
      .and('include', movie.backdrop_path);

    cy.get('.poster img').should('have.attr', 'src', movie.poster_path);
    cy.get('.movie-title').should('contain.text', movie.title);
    cy.get('.movie-rating').should('contain.text', `⭐️ ${movie.average_rating.toFixed(2)}`);
    cy.get('.movie-released').should('contain.text', `Released: ${movie.release_date}`);
    cy.get('.overview').within(() => {
      cy.get('p').first().should('contain.text', `Overview: ${movie.overview}`);
      cy.get('p').eq(1).should('contain.text', `Movie Length: ${movie.runtime} min.`);
      cy.get('p').eq(2).should('contain.text', `Genres: ${movie.genres.map(genre => genre.name).join(', ')}`);
      cy.get('p').eq(3).should('contain.text', `Budget: $${movie.budget.toLocaleString()}`);
      cy.get('p').eq(4).should('contain.text', `Revenue: $${movie.revenue.toLocaleString()}`);
      cy.get('p').eq(5).should('contain.text', `Tagline: ${movie.tagline}`);
    });
  });
});

