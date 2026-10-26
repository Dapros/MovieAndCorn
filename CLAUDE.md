@AGENTS.md

# Movie And Corn (movies-tmdb) — reglas del proyecto

Web de películas en español que consume la API de TMDB. Logo: `public/logo.png` (favicon: `src/app/icon.png`). Diseño: seguir **DESIGN.md** siempre.

## Stack
- Next.js 16 (App Router, `src/`), React 19, TypeScript estricto, Tailwind v4.
- **Cache Components activado** (`cacheComponents: true`). Antes de usar una API de Next, lee la guía en `node_modules/next/dist/docs/`; no confíes en lo que recuerdes de versiones anteriores.
- Sin dependencias extra (nada de axios, librerías de UI ni gestores de estado). Si algo parece necesitarlas, pregunta primero.

## Comandos
- `npm run dev`: servidor local en http://localhost:3000
- `npm run build`: build de producción (también genera los tipos `PageProps<...>`)
- `npm run lint`
- `npm test`: `node --test` sobre `src/lib/*.test.ts`

## Arquitectura
- **Server Components por defecto.** `"use client"` solo cuando haga falta interactividad real (hoy solo `error.tsx`).
- **Todo acceso a TMDB pasa por `src/lib/tmdb.ts`.** Las funciones de datos llevan `"use cache"` + `cacheLife(...)`. No se llama a `fetch` a TMDB desde los componentes.
- La lógica pura (orden, filtros, paginación) está en `src/lib/query.ts`, sin imports de Next, para poder probarla con `node --test`. Cualquier cambio ahí viene con su prueba.
- **El estado vive en la URL** (`?genre=&sort=&q=&page=`). Filtros y búsqueda con `<Link>` y `<form method="get">`, no con `useState`. Para construir los enlaces del listado, usa `listHref()` de `src/components/Filters.tsx`.
- Leer `searchParams`/`params` siempre dentro de `<Suspense>`, con un skeleton como fallback (requisito de Cache Components).
- Las películas inexistentes llaman a `notFound()`. Los errores de red lanzan una excepción y los recoge `error.tsx`.

## Seguridad
- `TMDB_TOKEN` (Read Access Token v4) solo está en `.env.local` y se lee en el servidor. Nunca uses el prefijo `NEXT_PUBLIC_` ni lo pases a componentes cliente.
- Valida los parámetros de la URL antes de mandarlos a TMDB (ids numéricos, página entre 1 y 500, `sort` dentro de `SORTS`).
- Las imágenes vienen solo de `image.tmdb.org` (ver `next.config.ts`).

## Calidad
- Accesibilidad: `alt` en los pósters, `aria-current` en el filtro activo, `label` en los inputs, foco visible y contraste AA.
- Textos de la interfaz en español. Idioma de TMDB: constante `LANGUAGE` en `tmdb.ts`.
- Pie con la atribución a TMDB (obligatoria según sus condiciones de uso).
- Antes de dar algo por terminado: `npm run lint && npm test && npm run build`.
