# Repository Guidelines

## Project Structure & Module Organization

- `src/`: NestJS backend (modules like `bookings/`, `slots/`, `event-types/`, `admin/`; shared code in `common/`, `domain/`, `storage/`).
- `frontend/`: React + Vite app (`frontend/src/pages/`, `frontend/src/components/`, `frontend/src/api/`).
- `typespec/`: API contract (`typespec/main.tsp`) compiled to OpenAPI in `typespec/dist/`.
- Build output is intentionally disposable: `dist/` and `frontend/dist/` are gitignored.

## Build, Test, and Development Commands

Backend (from repo root):

- `npm install`: install backend dependencies.
- `npm run start:dev`: start the API in watch mode (defaults to `PORT=4010`).
- `npm run build`: compile to `dist/`.

Frontend:

- `npm --prefix frontend install`
- `npm --prefix frontend run dev`: start Vite dev server.
- `npm --prefix frontend run build`: typecheck + production build.
- `npm --prefix frontend run lint`: run ESLint (`frontend/eslint.config.js`).

API contract / mocks:

- `npm --prefix typespec run build`: generates `typespec/dist/openapi.json`.
- `npm --prefix frontend run dev:mock`: rebuild OpenAPI and run Prism mock on `:4010`.

## Coding Style & Naming Conventions

- TypeScript: follow existing conventions (2-space indentation, single quotes, no semicolons).
- Backend filenames: kebab-case with role suffixes (e.g., `bookings.service.ts`, `admin-bookings.controller.ts`).
- Frontend components/pages: `PascalCase.tsx` (e.g., `AdminSlotsPage.tsx`).

## Testing Guidelines

- No test runner is configured yet. Validate changes with `npm run build` (backend) and `npm --prefix frontend run build` + `npm --prefix frontend run lint`.

## Commit & Pull Request Guidelines

- Commit messages in history are short and imperative (e.g., `Add frontend`). Keep the same style and scope.
- PRs include: what changed, how to verify (`start:dev`, `frontend dev`), screenshots for UI changes, and notes for any API/TypeSpec changes.

## Configuration & Security Tips

- Frontend talks to the API via `VITE_API_BASE_URL` (defaults to `http://127.0.0.1:4010`).
- Don’t commit secrets; use `.env.example` when documenting new environment variables.

## Agent-Specific Notes

- Prefer editing source `*.ts`/`*.tsx`. If generated artifacts (`*.js`, `*.d.ts`, `*.map`) appear in your diff, confirm they’re intentional.
