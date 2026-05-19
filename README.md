# Mango — Range Component · Technical Test

Custom dual-handle range slider built with Next.js 16, React 19, TypeScript and Tailwind CSS v4.

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
npm install
```

## Ejecución

El proyecto requiere dos servidores corriendo en paralelo: Next.js en el puerto 8080 y un mock API (json-server) en el puerto 3001.

```bash
npm run dev:all
```

Abre [http://localhost:8080](http://localhost:8080) en el navegador.

Para correr solo el frontend (sin mock API, usa valores por defecto):

```bash
npm run dev
```

## Tests

```bash
npm test
```

Los tests usan Jest + React Testing Library. No requieren que los servidores estén corriendo.

## Estructura del proyecto

```
app/
├── (components)/
│   ├── exercises/
│   │   ├── Exercise1.tsx      # Componente cliente — slider de rango libre
│   │   └── Exercise2.tsx      # Componente cliente — slider de pasos fijos
│   └── ui/
│       ├── Range.tsx          # Componente <Range /> unificado (libre + pasos)
│       ├── Navbar.tsx         # Barra de navegación
│       └── useDragHandle.ts   # Hook de arrastre (mouse y touch)
├── exercise1/
│   └── page.tsx               # Server Component — fetch /exercise1
├── exercise2/
│   └── page.tsx               # Server Component — fetch /exercise2
├── layout.tsx
└── page.tsx                   # Página principal
db.json                        # Datos del mock API
```

## Ejercicios

### Exercise 1 — Rango libre (`/exercise1`)

Slider con mínimo y máximo definidos por la API (`GET /exercise1` → `{ min, max }`). El usuario puede arrastrar los handles o hacer clic en los labels numéricos para escribir un valor directamente. Se valida que el valor esté dentro del rango permitido.

### Exercise 2 — Pasos fijos (`/exercise2`)

Slider cuyos valores posibles son una lista discreta de precios (`GET /exercise2` → `{ rangeValues: number[] }`). Los handles solo pueden posicionarse en los valores de la lista. Los labels muestran el precio formateado como moneda.

## Componente `<Range />`

```tsx
// Modo libre
<Range
  minLimit={0}
  maxLimit={100}
  currentMin={20}
  currentMax={80}
  onChange={({ min, max }) => ...}
/>

// Modo pasos fijos
<Range
  steps={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
  currentMin={0}
  currentMax={5}
  onChange={({ min, max }) => ...}
/>
```

| Prop | Tipo | Descripción |
|---|---|---|
| `steps` | `number[]` | Lista de valores discretos. Si se pasa, activa el modo pasos. |
| `minLimit` | `number` | Valor mínimo absoluto (modo libre). Default: `0`. |
| `maxLimit` | `number` | Valor máximo absoluto (modo libre). Default: `100`. |
| `currentMin` | `number` | Índice o valor actual del handle mínimo. |
| `currentMax` | `number` | Índice o valor actual del handle máximo. |
| `onChange` | `({ min, max }) => void` | Callback invocado al mover un handle. |

### Interacción

- **Arrastre** con mouse y touch (mobile)
- **Clic en label** (modo libre) para escribir un valor exacto
- **Teclado**: `←` `→` `↑` `↓` mueven el handle de uno en uno; `Home` va al mínimo, `End` al máximo
- **Cursor**: `grab` al hacer hover, `grabbing` durante el arrastre
- **ARIA**: `role="slider"` con `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`
