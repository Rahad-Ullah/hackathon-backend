# Memory — NestJS Prisma Infrastructure Setup

Last updated: 2026-08-13T06:07:00+06:00

## What was built

- Resolved Prisma 7 `PrismaClientInitializationError` by installing `@prisma/adapter-pg` and `pg`.
- Updated `src/lib/database/prisma.service.ts` to instantiate `PrismaPg` pool adapter and pass `{ adapter }` to `super({ adapter })`.
- Fixed `prisma/schema.prisma` for Prisma 7 compatibility (`provider = "prisma-client-js"`, URL managed via `prisma.config.ts`).
- Created `@Global()` infrastructure module `src/lib/database/prisma.module.ts` exported and imported into `AppModule`.
- Verified `npm run build` and server startup cleanly with no driver adapter errors.

## Decisions made

- Configured `PrismaService` with `@prisma/adapter-pg` driver adapter required by Prisma 7.
- Enforced NestJS dependency injection architecture (`src/lib/database/prisma.module.ts`).

## Current state

- NestJS server initializes `PrismaModule` cleanly without initialization errors.

## Next session starts with

- Define feature models in `prisma/schema.prisma` and create domain feature modules in `src/module/<name>/`.

## Open questions

- Which feature module or entity should be constructed first?
