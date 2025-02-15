import { WatchedMovie } from './WatchedMovie';

export const WatchedMovieList = ({ watched, onDeleteWatched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
};
