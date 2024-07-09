import PropTypes from 'prop-types';
import './MoviePage.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MoviePage({ movie: initialMovie }) {
  const { movieID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(initialMovie || null);
  const [error, setError] = useState(false);
  const [movieData, setMovieData] = useState(null) 

  useEffect(() => {
    setMovie(initialMovie)
    if (!movieData) {
      handleMovieSelection(movieID);
    }
  }, [movieID, initialMovie]);

  const handleMovieSelection = async (id) => {
    try {
      const response = await fetch(`https://rancid-tomatillos.herokuapp.com/api/v2/movies/${id}`);
      console.log('response', response)
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

  const backdropStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url(${movie.backdrop_path})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: '-1'
  };

  return (
    <div className="movie-detail" style={backdropStyle}>
      <button onClick={() => navigate('/')}>Back to All Movies</button>
      <div className='poster'>
        <img src={movie.poster_path} alt={movie.title} />
      </div>
      <div className='movieSpecs'>
        <h3 className='movie-title'>{movie.title}</h3>
        <h4 className='movie-rating'>⭐️ {movie.average_rating.toFixed(2)}</h4>
        <h4 className='movie-released'>Released: {movie.release_date}</h4>
        <div className='overview'>
          <p>Overview: {movie.overview}</p>
          <p>Movie Length: {movie.runtime} min.</p>
          <p>Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
          <p>Budget: ${movie.budget.toLocaleString()}</p>
          <p>Revenue: ${movie.revenue.toLocaleString()}</p>
          <p>Tagline: {movie.tagline}</p>
        </div>
      </div>
    </div>
  );
}

MoviePage.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number,
    backdrop_path: PropTypes.string,
    title: PropTypes.string,
    release_date: PropTypes.string,
    average_rating: PropTypes.number,
    overview: PropTypes.string,
    genres: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })),
    budget: PropTypes.number,
    revenue: PropTypes.number,
    runtime: PropTypes.number,
    tagline: PropTypes.string
  }),
};

export default MoviePage;
