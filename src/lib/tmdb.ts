import { cacheLife } from "next/cache";
import { buildListQuery, type ListParams } from "./query";

const API = "https://api.themoviedb.org/3";
const LANGUAGE = "es-ES";

export type Genre = { id: number; name: string };
export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
};
export type MovieList = { page: number; total_pages: number; results: Movie[] };
export type MovieDetail = Movie & {
  tagline: string;
  runtime: number | null;
  genres: Genre[];
  budget: number;
  revenue: number;
  status: string;
  original_title: string;
  production_companies: { id: number; name: string }[];
  videos: { results: { key: string; site: string; type: string; name: string }[] };
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
    crew: { id: number; name: string; job: string }[];
  };
};

async function tmdbFetch<T>(path: string, params = new URLSearchParams()): Promise<T | null> {
  const token = process.env.TMDB_TOKEN;
  if (!token) throw new Error("Falta TMDB_TOKEN en .env.local");
  params.set("language", LANGUAGE);
  const res = await fetch(`${API}${path}?${params}`, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`TMDB ${res.status} en ${path}`);
  return res.json();
}

export async function getGenres() {
  "use cache";
  cacheLife("days");
  const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
  return data?.genres ?? [];
}

export async function listMovies(p: ListParams) {
  "use cache";
  cacheLife("hours");
  const { path, params } = buildListQuery(p, new Date().toISOString().slice(0, 10));
  const data = await tmdbFetch<MovieList>(path, params);
  return data ?? { page: 1, total_pages: 0, results: [] };
}

export async function getMovie(id: string) {
  "use cache";
  cacheLife("hours");
  if (!/^\d+$/.test(id)) return null;
  return tmdbFetch<MovieDetail>(`/movie/${id}`, new URLSearchParams({ append_to_response: "videos,credits" }));
}

export function img(path: string | null, size: "w185" | "w342" | "w500" | "w1280" | "original") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}
