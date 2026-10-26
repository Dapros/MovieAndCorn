# DESIGN.md — "Sala de cine"

La interfaz es una sala a oscuras: el contenido (pósters y backdrops) es la pantalla iluminada y todo lo demás se aparta. Siempre oscuro, sin tema claro.

## Color
Tokens definidos en `src/app/globals.css` (`@theme`). Usa siempre el token, nunca un hex suelto.

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0a0a0b` | Fondo de la página |
| `surface` | `#141416` | Tarjetas, inputs, paneles |
| `surface-2` | `#1d1d21` | Estado activo y hover de superficies |
| `line` | `#2a2a30` | Bordes y anillos de 1px |
| `fg` | `#f5f5f5` | Texto principal |
| `muted` | `#a1a1aa` | Texto secundario y metadatos |
| `accent` | `#e50914` | Rojo telón: CTA, género activo, logo, hover de títulos |
| `gold` | `#f5c518` | Solo para la valoración (★) y el anillo de foco |

- El rojo es escaso: como mucho un elemento rojo dominante por vista (filtro activo o CTA).
- El dorado solo aparece en notas y en el foco.

## Tipografía
- **Bebas Neue** (`font-display`): logo, títulos de página y de sección (h1/h2) y pestañas de orden. Siempre con `tracking-wide`.
- **Inter** (`font-sans`): todo lo demás. Cuerpo `text-sm`/`text-base`, metadatos `text-xs text-muted`.
- Título del detalle: `text-5xl` en móvil y `md:text-7xl`, con `leading-none`.

## Imágenes
- Pósters en proporción **2:3** (`aspect-[2/3]`), con `rounded-lg`, `ring-1 ring-line` y `object-cover`.
- Tamaños de TMDB: rejilla `w342`, detalle `w500`, reparto `w185`, backdrop `w1280`. No uses `original`.
- Sin póster: tarjeta `surface` con el título en `font-display text-muted`.
- Backdrop del detalle: `opacity-40` con un degradado `from-bg via-bg/70 to-bg/20` hacia arriba, para que el texto siempre se lea.

## Layout
- Contenedor `max-w-7xl` con `px-4`. La cabecera es sticky, con `bg-bg/85 backdrop-blur` y borde inferior `line`.
- Rejilla de películas: 2 / 3 / 4 / 6 columnas (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6`) con `gap-4`.
- Las filas horizontales (géneros, reparto) usan `overflow-x-auto` con márgenes negativos (`-mx-4 px-4`) para llegar al borde en móvil.
- Detalle: en escritorio, dos columnas `2fr / 1fr` (contenido + ficha técnica en `aside`).

## Scroll
- Todas las barras de scroll (página, géneros, reparto): barra en `accent`, pista en `muted` al 20% y `accent-hover` al pasar el ratón. Se definen de forma global en `globals.css`; las filas horizontales no necesitan clases extra.

## Componentes
- **Logo**: `public/logo.png` a 40px + "Movie <span accent>And</span> Corn" en `font-display text-3xl`.
- **Chip de género**: `rounded-full`, borde `line`. Activo: `bg-accent` con texto blanco.
- **Pestaña de orden**: `font-display text-lg`. Activa: `bg-surface-2 text-fg`.
- **Botón primario**: `bg-accent hover:bg-accent-hover`, `rounded-md`, `font-semibold`.
- **Botón secundario** (paginación): `bg-surface border-line`, y en hover el borde y el texto pasan a `accent`.
- **Nota**: insignia `bg-black/75 text-gold font-bold` con "★ 7.8".

## Movimiento
- Hover en el póster: `scale-105` + viñeta `from-black/80`, `duration-300`. Nada más llamativo que eso.
- Carga: skeletons con `animate-pulse bg-surface` que imitan la forma real (no spinners).

## Accesibilidad
- Contraste AA mínimo (`muted` sobre `bg` lo cumple; no uses textos más oscuros que `muted`).
- Foco visible: contorno `gold` de 2px (global).
- Los backdrops decorativos llevan `alt=""`. Los pósters llevan `alt="Póster de {título}"`.
