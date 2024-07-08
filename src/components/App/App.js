import { useState, useEffect } from 'react';
import './App.css';
import MovieCards from '../MovieCards/MovieCard';
import MoviePage from '../MoviePage/MoviePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

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

  return (
    <Router>
      <main className="App">
        <header className="App-header">🍅 Rancid Tomatillos 🍅</header>
        {error && <p className="error">{error}</p>}
        <Routes>
          <Route exact path="/" element={
            <div className="movie-list">
              {movies.map(movie => (
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
