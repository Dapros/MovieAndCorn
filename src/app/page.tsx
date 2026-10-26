import { Suspense } from "react";
import Link from "next/link";
import { Filters } from "@/components/Filters";
import { MovieCard, MovieGridSkeleton } from "@/components/MovieCard";
import { Pagination } from "@/components/Pagination";
import { clampPage, toSort, type ListParams } from "@/lib/query";
import { getGenres, listMovies } from "@/lib/tmdb";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <Catalog searchParams={searchParams} />
    </Suspense>
  );
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function Catalog({ searchParams }: Pick<PageProps<"/">, "searchParams">) {
  const sp = await searchParams;
  const params: ListParams = { genre: one(sp.genre), sort: one(sp.sort), page: one(sp.page), q: one(sp.q)?.trim() };
  const [genres, data] = await Promise.all([getGenres(), listMovies(params)]);
  const page = clampPage(params.page);

  return (
    <>
      {params.q ? (
        <div className="mb-6">
          <h1 className="font-display text-4xl tracking-wide">Resultados para “{params.q}”</h1>
          <p className="text-sm text-muted">
            La búsqueda no admite filtros de género. <Link href="/" className="text-accent underline">Volver al catálogo</Link>
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <h1 className="sr-only">Catálogo de películas</h1>
          <Filters genres={genres} genre={params.genre} sort={toSort(params.sort)} />
        </div>
      )}

      {data.results.length === 0 ? (
        <p className="py-20 text-center text-muted">No se encontraron películas.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {data.results.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
      )}

      <Pagination params={params} page={page} total={data.total_pages} />
    </>
  );
}
