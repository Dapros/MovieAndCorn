"use client";

export default function Error({ error, retry }: { error: Error; retry: () => void }) {
  // En producción Next oculta el mensaje de errores del servidor; solo se detecta en dev.
  const noToken = error.message.includes("TMDB_TOKEN");
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <h1 className="font-display text-5xl text-accent">Corte de proyección</h1>
      <p className="mt-4 text-muted">
        {noToken
          ? "Falta el token de TMDB. Copia .env.example a .env.local, pega tu API Read Access Token en TMDB_TOKEN y reinicia el servidor."
          : "No pudimos cargar los datos de TMDB. Inténtalo de nuevo."}
      </p>
      <button onClick={() => retry()} className="mt-6 rounded-md bg-accent px-5 py-2 font-semibold hover:bg-accent-hover">
        Reintentar
      </button>
    </div>
  );
}
