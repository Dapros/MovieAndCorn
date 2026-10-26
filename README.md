# Movie And Corn

Web para mantener a las personas informadas sobre las películas nuevas que se estrenan, con datos de la API de [TMDB](https://www.themoviedb.org).

## Funciones
- Catálogo ordenado por populares, mejor valoradas, recientes o más taquilleras
- Filtro por género y búsqueda por título
- Ficha de cada película con sinopsis, tráiler, reparto y datos de producción

## Tecnologías
Next.js 16, React 19, TypeScript y Tailwind CSS v4.

## Puesta en marcha
1. Consigue el **API Read Access Token** en [TMDB → Ajustes → API](https://www.themoviedb.org/settings/api).
2. Copia `.env.example` a `.env.local` y pega el token en `TMDB_TOKEN`.
3. Instala y arranca:

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Scripts
| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | Linter |
| `npm test` | Pruebas |

---
Este producto usa la API de TMDB, pero TMDB no lo avala ni lo certifica.
