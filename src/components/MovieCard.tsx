import Image from "next/image";
import Link from "next/link";
import { img, type Movie } from "@/lib/tmdb";

export function MovieCard({ movie }: { movie: Movie }) {
  const poster = img(movie.poster_path, "w342");
  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface ring-1 ring-line">
        {poster ? (
          <Image
            src={poster}
            alt={`Póster de ${movie.title}`}
            fill
            sizes="(min-width:1280px) 16vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-3 text-center font-display text-xl text-muted">
            {movie.title}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 transition group-hover:opacity-100" />
        {movie.vote_average > 0 && (
          <span className="absolute top-2 left-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-bold text-gold">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        )}
      </div>
      <h3 className="mt-2 line-clamp-1 text-sm font-medium group-hover:text-accent">{movie.title}</h3>
      <p className="text-xs text-muted">{movie.release_date?.slice(0, 4) || "—"}</p>
    </Link>
  );
}

export function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" aria-hidden>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] animate-pulse rounded-lg bg-surface" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-surface" />
        </div>
      ))}
    </div>
  );
}
