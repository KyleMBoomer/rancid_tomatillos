import PropTypes from 'prop-types';
import './MovieCard.css';

function MovieCards(props) {
  const { movie, onClick } = props;

  const handleClick = (event) => {
    event.stopPropagation();
    onClick();
  };

  return (
    <div className="movie-cards" onClick={handleClick}>
      <img src={movie.poster_path} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <p>⭐️ {movie.average_rating.toFixed(2)}</p>
    </div>
  );
}

MovieCards.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    poster_path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    average_rating: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MovieCards;
