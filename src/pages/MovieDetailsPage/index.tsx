import { Link, useParams, useNavigate, Outlet } from "react-router";
import css from "./MovieDetailsPage.module.css";
import {
  getImageURL,
  useTheMoviewDBAPI,
  type MovieDetails,
} from "../../context/TheMovieDBAPI";
import defaultPoster from "../../assets/default-poster.png";
import { useEffect, useState } from "react";

export default function MovieDetailsPage() {
  const { movieID } = useParams();
  const api = useTheMoviewDBAPI()!;
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails>();

  useEffect(() => {
    (async () => {
      try {
        const data = await api.movieDetails({ id: movieID! });
        setMovie(data);
      } catch (error) {
        navigate("/not-found");
        console.error("Failed to fetch movie details:", error);
      }
    })();
  }, [movieID, api, navigate]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (!movie) {
    return <div className={css.container}>Loading...</div>;
  }

  return (
    <div className={css.container}>
      <button onClick={handleGoBack} className={css.goBackButton}>
        Go Back
      </button>
      <div className={css.card}>
        <img
          src={getImageURL(movie.poster, "w342") || defaultPoster}
          alt={`${movie.title} poster`}
          className={css.poster}
        />
        <div className={css.details}>
          <h1 className={css.title}>{movie.title}</h1>
          <p className={css.overview}>{movie.overview}</p>
          <div className={css.genres}>
            {movie.genres.map((genre) => (
              <span key={genre} className={css.genre}>
                {genre}
              </span>
            ))}
          </div>
          <div className={css.links}>
            <Link to="reviews" className={css.link} replace>
              View Reviews
            </Link>
            <Link to="cast" className={css.link} replace>
              View Cast
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
