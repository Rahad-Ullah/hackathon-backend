# Memory — Role-Based Access Control on Hackathon Endpoints

Last updated: 2026-08-16T17:13:00+06:00

## What was built

- Created RBAC decorator [src/common/decorators/roles.decorator.ts](file:///c:/Users/RAHAD/OneDrive/Projects/hackathon/src/common/decorators/roles.decorator.ts) (`@Roles(...roles)`).
- Created RBAC guard [src/common/guards/roles.guard.ts](file:///c:/Users/RAHAD/OneDrive/Projects/hackathon/src/common/guards/roles.guard.ts) (`RolesGuard` checking `user.role` against metadata).
- Updated [src/common/index.ts](file:///c:/Users/RAHAD/OneDrive/Projects/hackathon/src/common/index.ts) re-exporting `Roles` and `RolesGuard`.
- Updated [src/module/hackathon/hackathon.controller.ts](file:///c:/Users/RAHAD/OneDrive/Projects/hackathon/src/module/hackathon/hackathon.controller.ts):
  - Applied `@UseGuards(RolesGuard)` to the controller.
  - `@Roles('admin')` enforced on write endpoints (`POST /hackathons`, `PATCH /hackathons/:id`, `DELETE /hackathons/:id`).
  - Read access available to all via `@AllowAnonymous()` on `GET /hackathons` and `GET /hackathons/:id`.
- Verified `npm run build` compiles cleanly with zero errors.

## Decisions made

- Reusable `RolesGuard` and `@Roles` decorator created in `src/common/` to follow `AGENTS.md` guidelines.
- `admin` role required for write operations; public read access preserved for all users.

## Current state

- Role-based access control active on Hackathon endpoints.
- `npm run build` succeeds cleanly.

## Next session starts with

- Add unit/integration tests for RBAC guard and hackathon controller or implement participant features.

## Open questions

- None.
