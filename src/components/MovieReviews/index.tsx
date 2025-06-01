import { useEffect, useState } from "react";
import {
  getImageURL,
  useTheMoviewDBAPI,
  type Review,
} from "../../context/TheMovieDBAPI";
import { useParams } from "react-router";
import css from "./MovieReviews.module.css";
import defaultAvatar from "../../assets/default-avatar.png";

export default function MovieReviews() {
  const { movieID } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useTheMoviewDBAPI()!;

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.movieReviews({ id: movieID!, page: page + 1 });
      setReviews([...reviews, ...data.results]);
      setPage(page + 1);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setReviews([]);
    setPage(0);
    setTotalPages(0);
    fetchReviews();
  }, [movieID]);

  const fetchMoreReviews = async () => {
    if (page < totalPages) {
      await fetchReviews();
    }
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>Reviews</h2>
      {loading && <div className={css.loading}>Loading reviews...</div>}
      {error && <div className={css.error}>{error}</div>}
      {reviews.length === 0 && !loading && (
        <div className={css.noReviews}>No reviews available.</div>
      )}
      <div className={css.reviewList}>
        {reviews.map((review) => (
          <div key={review.id} className={css.review}>
            <div className={css.avatar}>
              <img
                src={getImageURL(review.author.avatar, "w92") || defaultAvatar}
                alt={`${review.author.username}'s avatar`}
              />
            </div>
            <div className={css.content}>
              <h4 className={css.username}>{review.author.username}</h4>
              <p className={css.text}>{review.content}</p>
              <span className={css.rating}>
                Rating: {review.author.rating || "N/A"}
              </span>
            </div>
          </div>
        ))}
        {page < totalPages && !loading && (
          <button onClick={fetchMoreReviews} className={css.loadMore}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
}
