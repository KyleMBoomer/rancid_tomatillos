import PropTypes from 'prop-types';
import './MoviePage.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MoviePage({ movie: initialMovie, onBackClick }) {
  const { movieID } = useParams();
  const [movie, setMovie] = useState(initialMovie || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!initialMovie) {
      handleMovieSelection(movieID);
    }
  }, [movieID, initialMovie]);

  const handleMovieSelection = async (id) => {
    try {
      const response = await fetch(`https://rancid-tomatillos.herokuapp.com/api/v2/movies/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const data = await response.json();
      setMovie(data.movie);
    } catch (error) {
      setError(true);
    }
  };

  if (error) {
    return <div>Error: Failed to fetch movie details. Please try again later.</div>;
  }

  if (!movie) {
    return <div>Loading...</div>;
  }
  return (
    <div className="movie-detail">
      <button onClick={onBackClick}>Back to All Movies</button>
      <img src={movie.backdrop_path} alt={`${movie.title} backdrop`} />
      <h2>{movie.title}</h2>
      <p>Release Date: {movie.release_date}</p>
      <p>⭐️ {movie.average_rating.toFixed(2)}</p>
    </div>
  );
}

MoviePage.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    backdrop_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    release_date: PropTypes.string.isRequired,
    average_rating: PropTypes.number.isRequired,
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};

export default MoviePage;
