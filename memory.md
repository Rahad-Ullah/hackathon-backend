# Memory — Hackathon Participant Join Endpoint

Last updated: 2026-08-16T19:12:00+06:00

## What was built

- Implemented `join(id, userId)` in [src/module/hackathon/hackathon.service.ts](file:///c:/Users/RAHAD/OneDrive/Projects/hackathon/src/module/hackathon/hackathon.service.ts):
  - Validates hackathon existence (via `findOne`).
  - Ensures `isActive` is `true` (throws `BadRequestException` if inactive).
  - Ensures current date does not exceed `endDate` (throws `BadRequestException` if ended).
  - Creates `HackathonParticipant` record.
  - Catches Prisma unique constraint error `P2002` and throws `ConflictException('You have already joined this hackathon')`.
- Added `POST /hackathons/:id/join` endpoint in [src/module/hackathon/hackathon.controller.ts](file:///c:/Users/RAHAD/OneDrive/Projects/hackathon/src/module/hackathon/hackathon.controller.ts):
  - Enforced `@Roles('participant')` access control.
  - Annotated with `@ResponseMessage('Successfully joined the hackathon')`.
- Verified `npm run build` passes cleanly with zero errors.

## Decisions made

- Unique constraint handling managed via Prisma error code `P2002` mapped to NestJS `ConflictException`.
- Restricted endpoint to `participant` role via `@Roles('participant')`.

## Current state

- Hackathon join API operational with validation checks and duplicate prevention.
- `npm run build` succeeds cleanly.

## Next session starts with

- Implement submission or team logic for hackathons if required.

## Open questions

- None.
