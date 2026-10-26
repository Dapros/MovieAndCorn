import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMovie, img, type MovieDetail } from "@/lib/tmdb";

export async function generateMetadata({ params }: PageProps<"/movie/[id]">): Promise<Metadata> {
  const movie = await getMovie((await params).id);
  return movie ? { title: movie.title, description: movie.overview } : { title: "No encontrada" };
}

export default function MoviePage({ params }: PageProps<"/movie/[id]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      {params.then(({ id }) => <Detail id={id} />)}
    </Suspense>
  );
}

const money = (n: number) =>
  n > 0 ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n) : "—";

async function Detail({ id }: { id: string }) {
  const movie = await getMovie(id);
  if (!movie) notFound();

  const backdrop = img(movie.backdrop_path, "w1280");
  const poster = img(movie.poster_path, "w500");
  const trailer =
    movie.videos.results.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    movie.videos.results.find((v) => v.site === "YouTube");
  const directors = movie.credits.crew.filter((c) => c.job === "Director").map((c) => c.name);
  const cast = movie.credits.cast.slice(0, 12);
  const year = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min` : null;

  return (
    <article>
      <section className="relative -mx-4 -mt-6 overflow-hidden">
        {backdrop && (
          <Image src={backdrop} alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/20" />
        <div className="relative flex flex-col gap-6 px-4 pt-10 pb-8 md:flex-row md:items-end">
          <div className="relative aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-lg bg-surface shadow-2xl ring-1 ring-line md:w-60">
            {poster && <Image src={poster} alt={`Póster de ${movie.title}`} fill sizes="240px" className="object-cover" />}
          </div>
          <div className="space-y-3">
            <h1 className="font-display text-5xl leading-none tracking-wide md:text-7xl">
              {movie.title} {year && <span className="text-muted">({year})</span>}
            </h1>
            {movie.original_title !== movie.title && <p className="text-sm text-muted">{movie.original_title}</p>}
            {movie.tagline && <p className="text-lg text-muted italic">{movie.tagline}</p>}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {movie.vote_average > 0 && (
                <span className="rounded bg-black/60 px-2 py-1 font-bold text-gold">★ {movie.vote_average.toFixed(1)}</span>
              )}
              {runtime && <span>{runtime}</span>}
              {movie.genres.map((g) => (
                <Link key={g.id} href={`/?genre=${g.id}`} className="rounded-full border border-line px-3 py-0.5 hover:border-accent hover:text-accent">
                  {g.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 space-y-10">
          <section>
            <h2 className="mb-3 font-display text-3xl tracking-wide">Sinopsis</h2>
            <p className="leading-relaxed text-muted">{movie.overview || "Sin sinopsis disponible."}</p>
          </section>

          {trailer && (
            <section>
              <h2 className="mb-3 font-display text-3xl tracking-wide">Tráiler</h2>
              <div className="aspect-video overflow-hidden rounded-lg ring-1 ring-line">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="h-full w-full"
                />
              </div>
            </section>
          )}

          {cast.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-3xl tracking-wide">Reparto</h2>
              <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
                {cast.map((p) => {
                  const photo = img(p.profile_path, "w185");
                  return (
                    <li key={p.id} className="w-28 shrink-0">
                      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface ring-1 ring-line">
                        {photo && <Image src={photo} alt={p.name} fill sizes="112px" className="object-cover" />}
                      </div>
                      <p className="mt-2 text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted">{p.character}</p>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <Facts movie={movie} directors={directors} />
      </div>
    </article>
  );
}

function Facts({ movie, directors }: { movie: MovieDetail; directors: string[] }) {
  const rows: [string, string][] = [
    ["Dirección", directors.join(", ") || "—"],
    ["Estreno", movie.release_date ? new Date(movie.release_date).toLocaleDateString("es-ES", { dateStyle: "long", timeZone: "UTC" }) : "—"],
    ["Estado", movie.status],
    ["Presupuesto", money(movie.budget)],
    ["Recaudación", money(movie.revenue)],
    ["Productoras", movie.production_companies.map((c) => c.name).join(", ") || "—"],
  ];
  return (
    <aside className="h-fit rounded-lg bg-surface p-5 ring-1 ring-line">
      <dl className="space-y-4">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs tracking-wider text-muted uppercase">{k}</dt>
            <dd className="mt-0.5">{v}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-6 pt-10 md:flex-row" aria-hidden>
      <div className="aspect-[2/3] w-44 rounded-lg bg-surface md:w-60" />
      <div className="flex-1 space-y-4">
        <div className="h-14 w-2/3 rounded bg-surface" />
        <div className="h-4 w-1/3 rounded bg-surface" />
        <div className="h-24 w-full rounded bg-surface" />
      </div>
    </div>
  );
}
