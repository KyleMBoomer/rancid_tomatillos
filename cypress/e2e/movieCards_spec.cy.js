import { movies, movieDetails } from '../support/mockData';

describe('Movie Cards Page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://rancid-tomatillos.herokuapp.com/api/v2/movies', {
      statusCode: 200,
      body: { movies },
    }).as('getMovies');

    movies.forEach(movie => {
      cy.intercept('GET', `https://rancid-tomatillos.herokuapp.com/api/v2/movies/${movie.id}`, {
        statusCode: 200,
        body: { movie: movieDetails[movie.id] },
      }).as(`getMovie${movie.id}`);
    });

    cy.visit('/');
  });

  it('should say 🍅 Rancid Tomatillos 🍅 in the header', () => {
    cy.get('header').contains('🍅 Rancid Tomatillos 🍅');
  });

  it('should display the genre dropdown', () => {
    cy.get('.genre-dropdown').should('be.visible');
  });

  it('should display the first 12 movies from the dummy data', () => {
    cy.wait('@getMovies');
    cy.get('.movie-cards').should('have.length', 12);
    cy.get('.movie-cards').each((card, index) => {
      cy.wrap(card).within(() => {
        cy.get('img').should('have.attr', 'src', movies[index].poster_path);
        cy.get('h3').should('contain.text', movies[index].title);
        cy.get('p').should('contain.text', `⭐️ ${movies[index].average_rating.toFixed(2)}`);
      });
    });
  });

  it('should make each movie card clickable and navigate to movie details page', () => {
    cy.get('.movie-cards').first().click();

    const firstMovie = movies[0];
    const firstMovieDetails = movieDetails[firstMovie.id];

    // Wait for the navigation and fetch call
    cy.wait(`@getMovie${firstMovie.id}`);

    // Check the URL to ensure it includes the movie ID
    cy.url().should('include', `/movies/${firstMovie.id}`);

    // Check the movie details page displays correct information
    cy.get('.movie-detail')
      .should('have.css', 'background-image')
      .and('include', firstMovieDetails.backdrop_path);
    cy.get('.poster img').should('have.attr', 'src', firstMovieDetails.poster_path);
    cy.get('.movie-title').should('contain.text', firstMovieDetails.title);
    cy.get('.movie-rating').should('contain.text', `⭐️ ${firstMovieDetails.average_rating.toFixed(2)}`);
    cy.get('.movie-released').should('contain.text', `Released: ${firstMovieDetails.release_date}`);
    cy.get('.overview').within(() => {
      cy.get('p').first().should('contain.text', `Overview: ${firstMovieDetails.overview}`);
      cy.get('p').eq(1).should('contain.text', `Movie Length: ${firstMovieDetails.runtime} min.`);
      cy.get('p').eq(2).should('contain.text', `Genres: ${firstMovieDetails.genres.map(genre => genre.name).join(', ')}`);
      cy.get('p').eq(3).should('contain.text', `Budget: $${firstMovieDetails.budget.toLocaleString()}`);
      cy.get('p').eq(4).should('contain.text', `Revenue: $${firstMovieDetails.revenue.toLocaleString()}`);
      cy.get('p').eq(5).should('contain.text', `Tagline: ${firstMovieDetails.tagline}`);
    });

    // Go back to the main page without actually navigating
    cy.go('back');
  });
});
