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

    cy.visit('http://localhost:3000/');
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

  it('should navigate to the correct movie page when a movie card is clicked', () => {
    cy.wait('@getMovies');
    cy.get('.movie-cards').first().click();
    const movieId = movies[0].id;
    cy.url().should('include', `/movies/${movieId}`);
  });
});


