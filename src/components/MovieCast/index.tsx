import { useParams } from "react-router";
import css from "./MovieCast.module.css";
import { useEffect, useState } from "react";
import {
  getImageURL,
  useTheMoviewDBAPI,
  type MovieCredits,
} from "../../context/TheMovieDBAPI";
import defaultAvatar from "../../assets/default-avatar.png";

export default function MovieCast() {
  const { movieID } = useParams();
  const [credits, setCredits] = useState<MovieCredits | undefined>(undefined);
  const api = useTheMoviewDBAPI()!;

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const data = await api.movieCredits({ id: movieID! });
        setCredits(data);
      } catch (error) {
        console.error("Failed to load movie credits:", error);
      }
    };

    fetchCredits();
  }, [movieID]);

  return (
    <div className={css.container}>
      <h2 className={css.title}>Cast</h2>
      <div className={css.castList}>
        {credits?.cast && credits.cast.length > 0 ? (
          credits.cast.map((member) => (
            <div key={member.id} className={css.castMember}>
              <div className={css.avatar}>
                <img
                  src={getImageURL(member.profile, "w92") || defaultAvatar}
                  alt={member.name}
                />
              </div>
              <div className={css.memberInfo}>
                <h4 className={css.memberName}>{member.name}</h4>
                <p className={css.characterName}>{member.character}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No cast information available.</p>
        )}
      </div>
    </div>
  );
}
