import { useNavigate } from "react-router";
import css from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>404</h1>
      <p className={css.message}>
        Oops! The page you are looking for does not exist.
      </p>
      <button onClick={handleGoHome} className={css.goHomeButton}>
        Go Home
      </button>
    </div>
  );
}
