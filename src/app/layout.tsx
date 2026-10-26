import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bebas = Bebas_Neue({ variable: "--font-bebas", weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Movie And Corn", template: "%s · Movie And Corn" },
  description: "Explora películas con datos de TMDB",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} ${bebas.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3">
            <Link href="/" aria-label="Movie And Corn, inicio" className="flex items-center gap-2 font-display text-3xl tracking-wide">
              <Image src="/logo.png" width={40} height={40} alt="" priority />
              <span>
                Movie <span className="text-accent">And</span> Corn
              </span>
            </Link>
            <form action="/" role="search" className="ml-auto flex w-full gap-2 sm:w-auto">
              <label htmlFor="q" className="sr-only">Buscar película</label>
              <input
                id="q"
                name="q"
                type="search"
                placeholder="Buscar película…"
                className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm placeholder:text-muted sm:w-64"
              />
              <button className="rounded-md bg-accent px-4 py-2 text-sm font-semibold hover:bg-accent-hover">
                Buscar
              </button>
            </form>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">{children}</main>
        <footer className="space-y-1 border-t border-line px-4 py-6 text-center text-xs text-muted">
          <p>
            Datos de{" "}
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">TMDB</a>.
            Este sitio no está avalado ni certificado por TMDB.
          </p>
          <p>
            By <span className="text-accent">Dapros</span> ·{" "}
            <a href="https://dapros.netlify.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-fg">dapros.netlify.app</a>
          </p>
        </footer>
      </body>
    </html>
  );
}
