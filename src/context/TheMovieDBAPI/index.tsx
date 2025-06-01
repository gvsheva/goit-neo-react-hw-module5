import axios from "axios";
import { createContext, useContext, useMemo, type ReactNode } from "react";

export interface Page<T> {
  page: number;
  totalPages: number;
  results: T[];
}

export interface Movie {
  id: string;
  title: string;
  overview: string;
  backdrop: string;
  poster: string | null;
}

export interface MovieDetails extends Movie {
  genres: string[];
}

export interface MovieCredits {
  cast: {
    id: string;
    name: string;
    character: string;
    profile: string | null;
  }[];
  crew: {
    id: string;
    name: string;
    job: string;
    profile: string | null;
  }[];
}

export interface Review {
  id: string;
  author: {
    username: string;
    rating: number;
    avatar: string | null;
  };
  content: string;
}

export interface TheMovieDBAPI {
  trendingMovies: ({
    window,
  }: {
    window: "day" | "week";
  }) => Promise<Page<Movie>>;
  searchMovie: ({
    query,
    page,
  }: {
    query: string;
    page: number;
  }) => Promise<Page<Movie>>;
  movieDetails: ({ id }: { id: string }) => Promise<MovieDetails>;
  movieCredits: ({ id }: { id: string }) => Promise<MovieCredits>;
  movieReviews: ({
    id,
    page,
  }: {
    id: string;
    page: number;
  }) => Promise<Page<Review>>;
}

const context = createContext<TheMovieDBAPI | null>(null);

export const useTheMoviewDBAPI = () => useContext(context);

export default function TheMovieDBAPIProvider({
  children,
}: {
  children: ReactNode;
}) {
  const accessToken: string = import.meta.env.VITE_ACCESS_TOKEN!;

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: "https://api.themoviedb.org/3",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }, [accessToken]);

  const api: TheMovieDBAPI = {
    trendingMovies: async ({ window }) => {
      const response = await axiosInstance.get("/trending/movie/" + window);
      return {
        page: response.data.page,
        totalPages: response.data.total_pages,
        results: response.data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdrop: movie.backdrop_path,
          poster: movie.poster_path,
        })),
      };
    },

    searchMovie: async ({ query, page }) => {
      const response = await axiosInstance.get("/search/movie", {
        params: { query, page },
      });
      return {
        page: response.data.page,
        totalPages: response.data.total_pages,
        results: response.data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          backdrop: movie.backdrop_path,
          poster: movie.poster_path,
        })),
      };
    },

    movieDetails: async ({ id }) => {
      const response = await axiosInstance.get(`/movie/${id}`);
      return {
        id: response.data.id,
        title: response.data.title,
        overview: response.data.overview,
        backdrop: response.data.backdrop_path,
        poster: response.data.poster_path,
        genres: response.data.genres.map((genre: any) => genre.name),
      };
    },

    movieCredits: async ({ id }) => {
      const response = await axiosInstance.get(`/movie/${id}/credits`);
      return {
        cast: response.data.cast.map((member: any) => ({
          id: member.id,
          name: member.name,
          character: member.character,
          profile: member.profile_path,
        })),
        crew: response.data.crew.map((member: any) => ({
          id: member.id,
          name: member.name,
          job: member.job,
          profile: member.profile_path,
        })),
      };
    },

    movieReviews: async ({ id, page }) => {
      const response = await axiosInstance.get(`/movie/${id}/reviews`, {
        params: { page },
      });
      return {
        page: response.data.page,
        totalPages: response.data.total_pages,
        results: response.data.results.map((review: any) => ({
          id: review.id,
          author: {
            username: review.author_details.username,
            rating: review.author_details.rating,
            avatar: review.author_details.avatar_path,
          },
          content: review.content,
        })),
      };
    },
  };

  return <context.Provider value={api}>{children}</context.Provider>;
}

const imageBaseURL = "https://image.tmdb.org/t/p";

export function getImageURL(path: string | null, size: string) {
  if (!path) {
    return null;
  }
  return `${imageBaseURL}/${size}/${path}`;
}
