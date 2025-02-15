import { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { Box } from './Box';
import { MovieList } from './MovieList';
import { MovieDetails } from './MovieDetails';
import { WatchedSummary } from './WatchedSummary';
import { WatchedMovieList } from './WatchedMovieList';

export const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = '38711e45';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
  };
  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  useEffect(() => {
    const controller = new AbortController();

    // if (!query.length) {
    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }
    // fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=michael`)
    //   .then((res) => res.json())
    //   .then((data) => setMovies(data.Search));
    handleCloseMovie();
    fetchMovies(controller);

    return () => {
      controller.abort();
    };
  }, [query]);

  const fetchMovies = async (controller) => {
    try {
      setIsLoading(true);
      setError('');

      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, {
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Something went wrong');

      const data = await res.json();
      if (data.Response === 'False') throw new Error('Movie not found');
      setMovies(data.Search);
      setError('');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log(error.message);
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const NavBar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};
const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const Search = ({ query, setQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const NumResults = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};
