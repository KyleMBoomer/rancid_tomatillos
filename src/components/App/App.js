import { useState, useEffect } from 'react';
import MovieCards from '../MovieCards/MovieCard';
import MoviePage from '../MoviePage/MoviePage';
import Dropdown from '../Dropdown/Dropdown';
import GlideComponent from '../Glide/Glide'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';


import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

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
    setSelectedMovie(null)
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleBackToMovies = () => {
    setSelectedMovie(null);
    setSelectedGenre('')
  }

  const handleBackToGenre = () => {
    setSelectedMovie(null)
  }

  const filteredMovies = selectedGenre
    ? movies.filter(movie => movie.genres.includes(selectedGenre))
    : movies;


  return (
    <Router>
      <main className="App">
        <header className="App-header">🍅 Rancid Tomatillos 🍅</header>
        {error && <p className="error">{error}</p>}
        <Routes>
          <Route exact path="/" element={
            <>
              {!selectedMovie && (
                <Dropdown selectedGenre={selectedGenre} handleGenreChange={handleGenreChange} />
              )}
              {!selectedGenre ? (
                <div className="movie-list">
                  {filteredMovies.map(movie => (
                    <MovieCards key={movie.id} movie={movie} onClick={() => handleMovieClick(movie)} />
                  ))}
                </div>
              ) : (
                <GlideComponent movies={filteredMovies} handleMovieClick={handleMovieClick} />
              )}
            </>
          } />
          <Route path="/movies/:movieID" element={<MoviePage onBack={handleBackToMovies} onBackToGenre={handleBackToGenre} selectedGenre={selectedGenre}/>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;