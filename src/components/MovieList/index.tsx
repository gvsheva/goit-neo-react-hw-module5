import { getImageURL, type Movie } from "../../context/TheMovieDBAPI";
import classNames from "classnames";
import defaultPoster from "../../assets/default-poster.png";
import css from "./MovieList.module.css";

interface MovieListProps {
  movies: Movie[];
  compact?: boolean;
  onSelect?: (movie: Movie) => void;
}

export default function MovieList({
  movies,
  compact = false,
  onSelect,
}: MovieListProps) {
  return (
    <div className={classNames(css.container, { [css.compact]: compact })}>
      {movies.map((movie) => (
        <div
          key={movie.id}
          className={classNames(css.card, { [css.compactCard]: compact })}
          onClick={() => onSelect?.(movie)}
        >
          <img
            src={
              getImageURL(movie.poster, compact ? "w92" : "w185") ||
              defaultPoster
            }
            alt={`${movie.title} poster`}
            className={classNames(css.poster, {
              [css.compactPoster]: compact,
            })}
          />
          <div className={classNames(css.info, { [css.compactInfo]: compact })}>
            <h3 className={css.title}>{movie.title}</h3>
            {!compact && <p className={css.overview}>{movie.overview}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
