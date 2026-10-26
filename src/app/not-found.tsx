import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-display text-6xl text-accent">404</h1>
      <p className="mt-2 text-muted">Esta película no está en cartelera.</p>
      <Link href="/" className="mt-6 inline-block text-accent underline">Volver al catálogo</Link>
    </div>
  );
}
