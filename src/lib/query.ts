// Lógica pura del listado, sin imports de Next, para poder probarla con `node --test`.
const MAX_PAGE = 500; // TMDB rechaza page > 500

export const SORTS = {
  popular: { label: "Populares", params: { sort_by: "popularity.desc" } },
  top: { label: "Mejor valoradas", params: { sort_by: "vote_average.desc", "vote_count.gte": "300" } },
  recent: { label: "Recientes", params: { sort_by: "primary_release_date.desc", "vote_count.gte": "20" } },
  revenue: { label: "Más taquilleras", params: { sort_by: "revenue.desc" } },
} as const;
export type Sort = keyof typeof SORTS;

export type ListParams = { genre?: string; sort?: string; page?: string; q?: string };

export function clampPage(page?: string) {
  const n = Number.parseInt(page ?? "1", 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), MAX_PAGE) : 1;
}

export function toSort(sort?: string): Sort {
  return sort && Object.hasOwn(SORTS, sort) ? (sort as Sort) : "popular";
}

/** Ruta + query de TMDB para el listado. */
export function buildListQuery({ genre, sort, page, q }: ListParams, today: string) {
  const params = new URLSearchParams({ page: String(clampPage(page)) });
  const query = q?.trim();
  if (query) {
    params.set("query", query);
    return { path: "/search/movie", params };
  }
  const s = toSort(sort);
  for (const [k, v] of Object.entries(SORTS[s].params)) params.set(k, v);
  if (s === "recent") params.set("primary_release_date.lte", today);
  if (genre && /^\d+$/.test(genre)) params.set("with_genres", genre);
  return { path: "/discover/movie", params };
}
