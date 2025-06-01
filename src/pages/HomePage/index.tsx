import { useEffect, useState } from "react";
import MovieList from "../../components/MovieList";
import { useTheMoviewDBAPI, type Movie } from "../../context/TheMovieDBAPI";
import css from "./HomePage.module.css";
import { useNavigate } from "react-router";

export default function HomePage() {
  const api = useTheMoviewDBAPI()!;
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTrendingMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.trendingMovies({ window: "day" });
      setMovies(result.results);
    } catch (err) {
      setError("Failed to fetch trending movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <div className={css.container}>
      <h2>Trending today</h2>
      {loading && <div className={css.loading}>Loading...</div>}
      {error && <div className={css.error}>{error}</div>}
      {movies.length === 0 && !loading && (
        <div className={css.noMovies}>No movies available.</div>
      )}
      <MovieList
        movies={movies}
        onSelect={(m) => navigate(`/movies/${m.id}`)}
      />
    </div>
  );
}
