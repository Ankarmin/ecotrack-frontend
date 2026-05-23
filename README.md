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
|- .env.docker.example
|- .env.railway.example
|- package.json
\- README.md
```

## Regla operativa

Todos los comandos del proyecto deben ejecutarse desde la raiz del repositorio.

## Requisitos

- Node.js `>= 18`
- pnpm `9.x`
- El backend de `ecotrack-backend` levantado si vas a probar integracion real

## Instalacion

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
- `NEXT_PUBLIC_API_TARGET`
- `NEXT_PUBLIC_API_BASE_URL_DOCKER`
- `NEXT_PUBLIC_API_BASE_URL_RAILWAY`

Variable opcional de override directo:

- `NEXT_PUBLIC_API_BASE_URL`

## Configuracion actual

Configuracion local actual de `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_TARGET=railway
NEXT_PUBLIC_API_BASE_URL_DOCKER=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL_RAILWAY=https://ecotrack-backend-production-2db4.up.railway.app
```

## Formas de uso

### Opcion 1: Frontend local + backend Docker

Este es el flujo principal actual de trabajo.

En `.env.local`:

```bash
NEXT_PUBLIC_API_TARGET=docker
```

Levantar backend y base de datos en `C:\Proyectos\ecotrack-backend`:

```bash
pnpm run docker:up
```

Levantar frontend en `C:\Proyectos\ecotrack-frontend`:

```bash
pnpm run dev
```

URLs esperadas:

```text
Frontend: http://localhost:3000
Backend: http://localhost:3001
```

### Opcion 2: Frontend local + backend Railway

En `.env.local`:

```bash
NEXT_PUBLIC_API_TARGET=railway
```

Luego levanta solo el frontend:

```bash
pnpm run dev
```

En este modo, las peticiones salen a la URL definida en `NEXT_PUBLIC_API_BASE_URL_RAILWAY`.

## Cambio rapido de target

Para cambiar entre Docker y Railway, solo cambia esta variable en `.env.local`:

```bash
NEXT_PUBLIC_API_TARGET=docker
```

o:

```bash
NEXT_PUBLIC_API_TARGET=railway
```

Manteniendo estas dos URLs definidas una sola vez:

```bash
NEXT_PUBLIC_API_BASE_URL_DOCKER=http://localhost:3001
NEXT_PUBLIC_API_BASE_URL_RAILWAY=https://ecotrack-backend-production-2db4.up.railway.app
```

Si defines `NEXT_PUBLIC_API_BASE_URL`, esa variable tiene prioridad sobre el target.

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run check-types
pnpm run start
pnpm run lint
```

## Integracion con backend

### Flujo con backend Docker

1. En `ecotrack-backend`:

```bash
pnpm run docker:up
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

### Flujo con backend Railway

1. Dejar `NEXT_PUBLIC_API_TARGET=railway` en `.env.local`.

2. Levantar el frontend:

```bash
pnpm run dev
```

3. Abrir:

```text
Frontend: http://localhost:3000
Backend: URL publica de Railway
```

## Produccion

Para despliegues, configura explicitamente:

```bash
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_TARGET=railway
NEXT_PUBLIC_API_BASE_URL_DOCKER=
NEXT_PUBLIC_API_BASE_URL_RAILWAY=
```
