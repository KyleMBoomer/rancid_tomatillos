import { useState, useEffect } from 'react';
import './App.css';
import MovieCards from '../MovieCards/MovieCard';
import MoviePage from '../MoviePage/MoviePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(''); // State for selected genre

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
      .then(data => {
        const moviePromises = data.movies.map(movie =>
          fetch(`https://rancid-tomatillos.herokuapp.com/api/v2/movies/${movie.id}`)
            .then(response => response.json())
        );
        Promise.all(moviePromises)
          .then(movieDetails => setMovies(movieDetails.map(detail => detail.movie)))
          .catch(error => {
            console.log(error.message);
            setError('Whoops, could not fetch your movie details. Refresh the page.');
          });
      })
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
        <select className='genre-dropdown' onChange={handleGenreChange} value={selectedGenre}>
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Drama">Drama</option>
          <option value="Horror">Horror</option>
        </select>
        <Routes>
          <Route exact path="/" element={
            <div className="movie-list">
              {filteredMovies.map(movie => (
                <MovieCards key={movie.id} movie={movie} />
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
