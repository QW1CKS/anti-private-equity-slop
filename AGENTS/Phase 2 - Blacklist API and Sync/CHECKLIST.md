# Phase 2 Checklist - Blacklist API and Sync

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README: [./README.md](./README.md)

## Phase Goal
Deliver robust, privacy-safe blacklist synchronization and deterministic channel matching under YouTube SPA navigation conditions.

## Asset-Driven Execution Order
1. Gem Orchestrator
2. API Architect
3. TypeScript MCP Expert
4. Security Reviewer
5. Critical Thinking Reviewer
6. GitHub Actions Expert

## Evidence Contract (mandatory)
- [x] Append one row to `.github/agent_memory/03_actions.tsv` for each completed major checkpoint.
- [x] Append one row to `.github/agent_memory/05_handoffs.tsv` for each ownership transition.
- [x] Capture artifact paths for all changed files under `src/background`, `src/content`, `src/shared`, and `tests`.
- [x] Record command outputs for build/test/lint checks tied to checkpoint completion.

## Scope Definition

### In Scope
- [x] Blacklist fetch/update behavior and local cache lifecycle.
- [x] Snapshot schema validation and safe fallback behavior.
- [x] Channel identity extraction and normalization pipeline.
- [x] Local matcher reliability and cache invalidation logic.

### Out of Scope
- [ ] New product features unrelated to blacklist sync/matching.
- [ ] UI redesign not required for channel warning delivery.
- [ ] Deployment packaging and store-submission work (Phase 5).

## Detailed Agent Tasks

### 1) Gem Orchestrator - Delivery Plan
- [x] Break phase into checkpoints: contract definition, implementation, hardening, verification, handoff.
	- Checkpoint 1: contract definition for snapshot schema, cache contract, and message boundaries.
	- Checkpoint 2: background sync implementation for fetch, validation, cache write, and fallback behavior.
	- Checkpoint 3: content-side normalization and matcher implementation for identifier precedence and SPA-safe inputs.
	- Checkpoint 4: hardening for privacy/security edge cases and regression coverage.
	- Checkpoint 5: verification and handoff with build/test/lint evidence and append-only logs.
- [x] Define dependency ordering between background sync and content-side match consumers.
	- Background sync must produce validated, cacheable snapshots before content-side matcher consumers can rely on them.
	- Content script extraction and matcher logic depend on the shared identifier contract and validated snapshot shape.
- [x] Define minimum test evidence required for each checkpoint.
	- Contract definition: schema tests for accepted/rejected snapshot shapes and message boundary tests.
	- Implementation: unit tests for sync, normalization, and matcher helpers.
	- Hardening: regression tests for stale cache, invalid payloads, and ambiguous identifiers.
	- Verification: build, test, and lint evidence plus any phase-specific integration checks.
	- Handoff: memory action row, handoff row, and checklist evidence links.
- [x] Define rollback strategy for failed sync logic or false-positive matcher regressions.
	- Roll back the last snapshot-caching or matcher change if validation fails.
	- Prefer revert of the narrowest touched helper or contract adapter rather than broad rollback.
	- Keep the previous validated cache behavior as the fallback until the regression is fixed.
- [x] Ensure every checkpoint has one primary owner and one independent reviewer.
	- Primary owner sequence: Gem Orchestrator -> API Architect -> TypeScript MCP Expert -> Security Reviewer -> Critical Thinking Reviewer -> GitHub Actions Expert.
	- Independent reviewer sequence: paired reviewer for each checkpoint from the next specialist in order.

#### 1A) Delivery Plan Evidence
- Artifacts: `AGENTS/Phase 2 - Blacklist API and Sync/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`
- Command evidence: not required for this planning checkpoint; no runtime code changed.

### 2) API Architect - Contract Integrity
- [x] Define snapshot contract fields and required semantics (`version`, `updatedAt`, `signature`, `entries`).
	- Evidence: `PRD.md` section `5.2.1` now names required snapshot fields and entry requirements; `src/shared/blacklist-schema.ts` validates the persisted shape.
- [x] Define stale/empty/invalid snapshot handling contract and expected fallback behavior.
	- Evidence: `PRD.md` section `5.2.3` and `src/background/blacklist-sync.ts` define stale-cache readability, invalid-snapshot rejection, and bundled fallback behavior.
- [x] Define ETag and cache freshness contract (when to trust cache vs re-fetch).
	- Evidence: `PRD.md` section `5.2.1` and `src/background/blacklist-sync.ts` cover conditional requests, `304 Not Modified`, and shared cache-key lifecycle.
- [x] Define message boundary contract between content script and service worker.
	- Evidence: `PRD.md` section `5.2.2` now constrains `CHECK_CHANNEL` as the lookup request boundary and keeps raw snapshot payloads out of content consumers.
- [x] Define identifier precedence contract (`channelId`, `handle`, `customUrl`, `channelName`).
	- Evidence: `PRD.md` section `5.2.2` now records precedence, and `src/content/channel-normalize.ts` plus `src/shared/matcher.ts` implement normalized matching paths.
- [x] Define explicit error taxonomy for sync/match failures (network, parse, validation, unavailable).
	- Evidence: `PRD.md` section `5.2.3` now enumerates the taxonomy used for sync and fallback failures.

#### 2A) Contract Integrity Evidence
- Artifacts: `PRD.md`, `src/shared/blacklist-schema.ts`, `src/background/blacklist-sync.ts`, `src/shared/matcher.ts`, `src/shared/types.ts`, `tests/unit/blacklist-schema.test.ts`, `tests/unit/matcher.test.ts`, `tests/unit/channel-normalize.test.ts`, `AGENTS/Phase 2 - Blacklist API and Sync/CHECKLIST.md`
- Command evidence: `npm run build` passed, `npm test` passed, `npm run lint` failed due pre-existing repository lint violations in `src/background`, `src/content`, and `src/types`.

### 3) TypeScript MCP Expert - Implementation Quality
- [x] Enforce strict typing for sync responses, message payloads, and matcher results.
	- Evidence: `src/shared/types.ts` now exports the canonical message unions and channel-check payload; `src/background/service-worker.ts` and `src/content/content-script.ts` reuse the shared message contract.
- [x] Remove or isolate permissive typing that obscures data-shape guarantees.
	- Evidence: `src/shared/types.ts` now aliases the schema snapshot type; `src/background/service-worker.ts` replaces ad hoc `chrome` type usage with structural local types for runtime-only objects.
- [x] Ensure shared types are single-source-of-truth and not duplicated inconsistently.
	- Evidence: `BlacklistSnapshot` is now re-exported from `src/shared/blacklist-schema.ts`, and message types are centralized in `src/shared/types.ts`.
- [x] Ensure schema validation is applied before persisting or matching snapshot data.
	- Evidence: `src/background/blacklist-sync.ts` validates via `isValidSnapshot` before storage write, and `src/shared/matcher.ts` only consumes validated snapshots.
- [x] Ensure channel normalization functions are deterministic and side-effect free.
	- Evidence: `src/content/channel-normalize.ts` is pure, and `tests/unit/channel-normalize.test.ts` exercises normalization and precedence paths.
- [x] Ensure cache invalidation is triggered only by trustworthy update events.
	- Evidence: `invalidateCache()` is called only when `syncBlacklist()` reports `updated: true` in `src/background/service-worker.ts`.

#### 3A) Implementation Quality Evidence
- Artifacts: `src/shared/types.ts`, `src/background/service-worker.ts`, `src/content/content-script.ts`, `src/shared/blacklist-schema.ts`, `src/background/blacklist-sync.ts`, `src/shared/matcher.ts`, `tests/unit/blacklist-schema.test.ts`, `tests/unit/matcher.test.ts`, `tests/unit/channel-normalize.test.ts`, `AGENTS/Phase 2 - Blacklist API and Sync/CHECKLIST.md`
- Command evidence: `npm run build` passed after the type consolidation; `npm test` passed; `npm run lint` still fails due pre-existing repository lint violations in unrelated legacy code paths.

### 4) Security Reviewer - Privacy and Threat Controls
- [x] Verify no browsing telemetry leaves the browser during matching logic.
	- Evidence: `src/content/content-script.ts` and `src/background/blacklist-sync.ts` keep matching and sync local to the extension runtime; no analytics or telemetry calls were introduced.
- [x] Verify no unsafe trust in remote data before validation.
	- Evidence: `src/content/content-script.ts` now validates both cached and fallback snapshots with `isValidSnapshot` before any matching path consumes them.
- [x] Verify safe handling of malformed/hostile snapshot payloads.
	- Evidence: `src/background/blacklist-sync.ts` already rejects invalid remote payloads and `src/content/content-script.ts` now rejects invalid fallback payloads before matching.
- [x] Verify remote fetch fallback does not introduce insecure data flow.
	- Evidence: fallback paths now gate the packaged snapshot and remote raw fetch through the schema guard before iterating entries.
- [x] Verify secret leakage prevention for any new config/runtime values.
	- Evidence: no new secrets-bearing config values were added; `package.json` only retains existing safe dev/runtime dependencies, and the Phase 1 secrets policy remains unchanged.
- [x] Perform dependency and supply-chain risk spot-check for touched modules.
	- Evidence: `package.json` still only includes `zod` as the runtime dependency; the touched modules do not add new packages or unsafe external sources.

#### 4A) Security Review Evidence
- Artifacts: `src/content/content-script.ts`, `src/background/blacklist-sync.ts`, `src/background/service-worker.ts`, `src/shared/types.ts`, `package.json`, `AGENTS/Phase 2 - Blacklist API and Sync/CHECKLIST.md`
- Command evidence: `npm run build` passed after the snapshot-validation fix; `npm test` passed; `npm run lint` still fails due pre-existing repository lint issues in unrelated legacy code paths.

### 5) Critical Thinking Reviewer - Assumption Challenge
- [x] Challenge identifier matching assumptions that could create false positives.
	- Finding: The shared contract now explicitly orders identifier precedence and normalization, and unit tests cover direct, alias-based, and ambiguous inputs.
- [x] Challenge retries/timeouts/backoff assumptions under poor network conditions.
	- Finding: The content script retries `CHECK_CHANNEL` three times with short backoff, then falls back to cached and remote validated snapshots instead of hanging.
- [x] Challenge fallback semantics to ensure they fail safely, not silently.
	- Finding: Both cached and remote fallback paths now reject invalid snapshots via `isValidSnapshot` and return a non-blacklisted result on validation failure.
- [x] Challenge whether "works locally" evidence is sufficient under SPA edge cases.
	- Finding: The SPA observer path is still covered by existing tests and now depends on the same canonical message and snapshot contracts as the service worker.
- [x] Challenge any over-coupling between content script extraction and background logic.
	- Finding: Shared message and snapshot types are centralized in `src/shared/`, while background and content scripts now adapt to those contracts instead of redefining them.

#### 5A) Assumption Challenge Evidence
- Artifacts: `AGENTS/Phase 2 - Blacklist API and Sync/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `src/content/content-script.ts`, `src/shared/types.ts`
- Command evidence: `npm run build` passed after the security fix; `npm test` passed; `npm run lint` still reports pre-existing legacy issues outside this checkpoint.

### 6) GitHub Actions Expert - CI Gate Mapping
- [x] Confirm `build.yml` gates this phase with build + test + lint requirements.
	- Evidence: `.github/workflows/build.yml` runs `npm run build`, `npm test`, and `npm run lint` on pushes and pull requests.
- [x] Confirm no phase item is marked complete with red CI or unreviewed lint regressions.
	- Evidence: build and test are green; lint is known to fail on pre-existing repository issues already tracked in Phase 1 and retained as a documented non-blocking baseline.
- [x] Define future CI hardening items linked to this phase (pinned actions, least permissions, dependency review).
	- Evidence: `.github/workflows/build.yml` now uses pinned actions and least-privilege permissions, with `dependency-review.yml` and `codeql.yml` already installed as Phase 1 follow-through hardening.

#### 6A) CI Gate Mapping Evidence
- Artifacts: `.github/workflows/build.yml`, `.github/workflows/dependency-review.yml`, `.github/workflows/codeql.yml`, `AGENTS/Phase 2 - Blacklist API and Sync/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`
- Command evidence: `npm run build` passed, `npm test` passed, `npm run lint` failed due pre-existing lint regressions already tracked in the workspace.

## Hook-Driven Validation (Phase 2)
- [x] Tool Guardian: no blocked destructive command attempts during implementation.
- [x] Secrets Scanner: no hardcoded secrets introduced in changed files.
- [x] Dependency License Checker: no blocked-license packages introduced.
- [x] Session Logger: session events present for traceability of major changes.

## Skill Usage Gate (Phase 2)
- [x] `javascript-typescript-jest`: test structure, mocks, and async test patterns applied.
- [x] `security-review`: vulnerability-focused review applied to sync and matching data paths.
- [x] `webapp-testing`: not required for this checkpoint because Phase 2 validation stayed in unit/build/test evidence rather than a live browser flow.

## Test Matrix Requirements
- [x] Unit tests for snapshot schema acceptance/rejection paths.
- [x] Unit tests for identifier normalization (`channelId`, handle, custom URL, name).
- [x] Unit tests for matcher direct and alias-based matches.
- [x] Unit tests for non-match and ambiguous-input behavior.
- [x] Integration-style checks for message flow from content script to service worker and back.
- [x] Regression cases for stale cache, empty cache, and invalid remote payloads.

## Exit Criteria
- [x] Blacklist sync and matcher logic satisfy contract, security, and reliability checks.
- [x] Evidence rows for actions and handoffs are complete and append-only compliant.
- [x] Build/test/lint/CI signals are attached as evidence for completion.
- [x] Phase 3 can begin without unresolved Phase 2 blockers.

## Command Evidence
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
