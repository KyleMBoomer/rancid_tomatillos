import { useState, useEffect } from 'react';
import MovieCards from '../MovieCards/MovieCard';
import MoviePage from '../MoviePage/MoviePage';
import Dropdown from '../Dropdown/Dropdown'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null)

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

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  const filteredMovies = selectedGenre
    ? movies.filter(movie => movie.genres.includes(selectedGenre))
    : movies;

  return (
    <Router>
      <main className="App">
        <header className="App-header">🍅 Rancid Tomatillos 🍅</header>
        {error && <p className="error">{error}</p>}
        {!selectedMovie && (
          <GenreDropdown selectedGenre={selectedGenre} handleGenreChange={handleGenreChange} />
        )}
        <Routes>
          <Route exact path="/" element={
            <div className="movie-list">
              {filteredMovies.map(movie => (
                <MovieCards key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
              ))}
            </div>
          } />
          <Route path="/movies/:movieID" element={<MoviePage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
