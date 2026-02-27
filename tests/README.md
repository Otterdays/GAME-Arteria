# Test Suite

Whole-folder test suite for Arteria. Run from repo root: **`npm test`**.

## Structure

| Folder | Purpose |
|--------|---------|
| **unit/engine/** | API-level tests for `@arteria/engine` (XPTable, TickSystem, GameEngine). Mirrors and retains behavior of `packages/engine/src/__tests__/`. |
| **integration/** | Placeholder for tests spanning engine + app or external services. |
| **e2e/** | Placeholder for Playwright or similar E2E tests. |

## Retained tests

- **packages/engine/src/__tests__/** — Original unit tests (XPTable.test.ts, TickSystem.test.ts) are unchanged and run as part of the suite.
- **tests/unit/engine/** — Same assertions via `@arteria/engine` public API.

## Commands

- **`npm test`** — Runs both projects: `packages/engine` + `tests/` (Jest multi-project).
- **`npm run test:engine`** — Runs only `packages/engine` tests.
- **`npm run test:suite`** — Runs only `tests/` (unit + integration + e2e).

## Config

- **jest.config.js** — Root config; `projects: ['packages/engine', 'tests']`.
- **tests/jest.config.js** — Suite config (ts-jest, `@arteria/engine` → engine source).
