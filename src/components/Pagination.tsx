import Link from "next/link";
import type { ListParams } from "@/lib/query";
import { listHref } from "./Filters";

const btn = "rounded-md border border-line bg-surface px-4 py-2 text-sm hover:border-accent hover:text-accent";

export function Pagination({ params, page, total }: { params: ListParams; page: number; total: number }) {
  const last = Math.min(total, 500); // TMDB no sirve más allá de la página 500
  if (last <= 1) return null;
  const to = (p: number) => listHref({ ...params, page: p > 1 ? String(p) : undefined });
  return (
    <nav aria-label="Paginación" className="mt-8 flex items-center justify-center gap-4">
      {page > 1 ? <Link href={to(page - 1)} className={btn}>← Anterior</Link> : <span />}
      <span className="text-sm text-muted">Página {page} de {last}</span>
      {page < last ? <Link href={to(page + 1)} className={btn}>Siguiente →</Link> : <span />}
    </nav>
  );
}
