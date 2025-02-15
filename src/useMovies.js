import { useEffect, useState } from 'react';

export const KEY = '38711e45';

export const useMovies = (query, callback) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    callback?.();

    const controller = new AbortController();

    // if (!query.length) {
    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    const fetchMovies = async () => {
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

    // handleCloseMovie();
    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return {
    movies,
    isLoading,
    error,
  };
};
