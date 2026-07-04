# EcoTrack Frontend

Frontend principal de EcoTrack construido con `Next.js`.

## Stack

- Node.js 18+
- pnpm 9
- Next.js 16
- React 19

## Estructura

```text
.
|- app/
|- components/
|- lib/
|- public/
|- .env.local
|- .env.example
|- package.json
\- README.md
```

## Regla operativa

Todos los comandos del proyecto deben ejecutarse desde la raiz del repositorio.

## Requisitos

- Node.js `>= 18`
- pnpm `9.x`
- El backend de `ecotrack-backend` levantado si vas a probar integración real

## Instalación

```bash
pnpm install
```

## Variables de entorno

Archivo plantilla:

```bash
.env.example
```

Archivo local esperado:

```bash
.env.local
```

Variables principales:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_BASE_URL`

Configuración local actual de `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Formas de uso

Levantar base de datos PostgreSQL en Docker (desde `ecotrack-backend`):

```bash
pnpm run docker:db
```

Levantar frontend:

```bash
pnpm run dev
```

URLs esperadas:

```text
Frontend: http://localhost:3000
Backend: http://localhost:3001
```

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run check-types
pnpm run start
pnpm run lint
```

## Integración con backend

1. En `ecotrack-backend`:

```bash
pnpm run docker:db
pnpm run dev
```

2. En `ecotrack-frontend`:

```bash
pnpm run dev
```

3. Abrir:

```text
Frontend: http://localhost:3000
Backend: http://localhost:3001
```
