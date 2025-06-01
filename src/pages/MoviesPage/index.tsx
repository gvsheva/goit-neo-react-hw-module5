import { useEffect, useState } from "react";
import MovieList from "../../components/MovieList";
import { Search } from "../../components/Search";
import css from "./MoviesPage.module.css";
import { useTheMoviewDBAPI, type Movie } from "../../context/TheMovieDBAPI";
import { useNavigate, useSearchParams } from "react-router";

export default function MoviesPage() {
  const api = useTheMoviewDBAPI()!;
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchParams((p) => {
      p.set("query", query);
      return p;
    });
  };

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!query) {
        return;
      }
      const result = await api.searchMovie({ query, page: page + 1 });
      setPage(page + 1);
      setTotalPages(result.totalPages);
      setMovies([...movies, ...result.results]);
    } catch (err) {
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMovies([]);
    setPage(0);
    setTotalPages(0);
    fetchMovies();
  }, [query]);

  const fetchMoreMovies = async () => {
    if (page < totalPages) {
      await fetchMovies();
    }
  };

  return (
    <div className={css.container}>
      <Search initQuery={query} onSearch={handleSearch} />
      {loading && <div className={css.loading}>Loading...</div>}
      {error && <div className={css.error}>{error}</div>}
      <MovieList
        movies={movies}
        onSelect={(m) => navigate(`/movies/${m.id}`)}
        compact
      />
      {page < totalPages && (
        <button onClick={fetchMoreMovies} className={css.loadMoreButton}>
          Load More
        </button>
      )}
    </div>
  );
}
