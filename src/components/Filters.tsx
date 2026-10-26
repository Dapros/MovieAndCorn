import Link from "next/link";
import { SORTS, type ListParams, type Sort } from "@/lib/query";
import type { Genre } from "@/lib/tmdb";

/** Construye un href de la portada conservando filtros y reiniciando la página. */
export function listHref(p: ListParams) {
  const qs = new URLSearchParams(Object.entries(p).filter(([, v]) => v) as [string, string][]);
  const s = qs.toString();
  return s ? `/?${s}` : "/";
}

const chip = "rounded-full border px-3 py-1 text-sm whitespace-nowrap transition";
const on = "border-accent bg-accent text-white";
const off = "border-line bg-surface text-muted hover:border-fg hover:text-fg";

export function Filters({ genres, genre, sort }: { genres: Genre[]; genre?: string; sort: Sort }) {
  return (
    <div className="space-y-4">
      <nav aria-label="Ordenar" className="flex flex-wrap gap-2">
        {(Object.keys(SORTS) as Sort[]).map((s) => (
          <Link
            key={s}
            href={listHref({ genre, sort: s === "popular" ? undefined : s })}
            aria-current={s === sort ? "page" : undefined}
            className={`rounded-md px-3 py-1.5 font-display text-lg tracking-wide ${s === sort ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"}`}
          >
            {SORTS[s].label}
          </Link>
        ))}
      </nav>
      <nav aria-label="Géneros" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
        <Link
          href={listHref({ sort: sort === "popular" ? undefined : sort })}
          aria-current={!genre ? "page" : undefined}
          className={`${chip} ${!genre ? on : off}`}
        >
          Todas
        </Link>
        {genres.map((g) => {
          const active = genre === String(g.id);
          return (
            <Link
              key={g.id}
              href={listHref({ genre: String(g.id), sort: sort === "popular" ? undefined : sort })}
              aria-current={active ? "page" : undefined}
              className={`${chip} ${active ? on : off}`}
            >
              {g.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
