import { useEffect, useRef, useState } from 'react';
import { Loader } from './Loader';
import { ErrorMessage } from './ErrorMessage';
import { Box } from './Box';
import { MovieList } from './MovieList';
import { MovieDetails } from './MovieDetails';
import { WatchedSummary } from './WatchedSummary';
import { WatchedMovieList } from './WatchedMovieList';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';

export const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = '38711e45';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  // });
  const [watched, setWatched] = useLocalStorageState([], 'watched');

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  function handleCloseMovie() {
    setSelectedId(null);
  }

  const handleAddWatched = (movie) => {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]));
  };
  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
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
  const inputEl = useRef(null);

  useKey('Enter', () => {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();
    setQuery('');
  });

  // useEffect(() => {
  //   function callback(e) {
  //     if (e.code === 'Enter') {
  //       if (document.activeElement === inputEl.current) return;
  //       inputEl.current.focus();
  //       setQuery('');
  //     }
  //   }

  //   document.addEventListener('keydown', callback);
  //   return () => {
  //     document.removeEventListener('keydown', callback);
  //   };
  // }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
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
