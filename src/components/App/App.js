import { useState, useEffect } from 'react';
import './App.css';
import MovieCards from '../MovieCards/MovieCard';
import MoviePage from '../MoviePage/MoviePage';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = () => {
    fetch('https://rancid-tomatillos.herokuapp.com/api/v2/movies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not GET your data.');
        }
        return response.json();
      })
      .then(data => setMovies(data.movies))
      .catch(error => {
        console.log(error.message);
        setError('Whoops, could not fetch your movies. Refresh the page.');
      });
  };

  const handleMovieClick = (id) => {
    setSelectedMovieId(id);
  };

  const handleBackClick = () => {
    setSelectedMovieId(null);
  };

  const selectedMovie = movies.find(movie => movie.id === selectedMovieId);

  return (
    <main className="App">
      <header className="App-header">🍅 Rancid Tomatillos 🍅</header>
      {error && <p className="error">{error}</p>}
      {selectedMovie ? (
        <MoviePage movie={selectedMovie} onBackClick={handleBackClick} />
      ) : (
        <div className="movie-list">
          {movies.map(movie => (
            <MovieCards key={movie.id} movie={movie} onClick={() => handleMovieClick(movie.id)} />
          ))}
        </div>
      )}
    </main>
  );
}

export default App;

