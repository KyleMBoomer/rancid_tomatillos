import './MoviePage.css';

function MoviePage({ movie, onBackClick }) {
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

export default MoviePage;
