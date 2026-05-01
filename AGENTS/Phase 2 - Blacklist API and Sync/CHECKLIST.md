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
- [ ] Append one row to `.github/agent_memory/03_actions.tsv` for each completed major checkpoint.
- [ ] Append one row to `.github/agent_memory/05_handoffs.tsv` for each ownership transition.
- [ ] Capture artifact paths for all changed files under `src/background`, `src/content`, `src/shared`, and `tests`.
- [ ] Record command outputs for build/test/lint checks tied to checkpoint completion.

## Scope Definition

### In Scope
- [ ] Blacklist fetch/update behavior and local cache lifecycle.
- [ ] Snapshot schema validation and safe fallback behavior.
- [ ] Channel identity extraction and normalization pipeline.
- [ ] Local matcher reliability and cache invalidation logic.

### Out of Scope
- [ ] New product features unrelated to blacklist sync/matching.
- [ ] UI redesign not required for channel warning delivery.
- [ ] Deployment packaging and store-submission work (Phase 5).

## Detailed Agent Tasks

### 1) Gem Orchestrator - Delivery Plan
- [ ] Break phase into checkpoints: contract definition, implementation, hardening, verification, handoff.
- [ ] Define dependency ordering between background sync and content-side match consumers.
- [ ] Define minimum test evidence required for each checkpoint.
- [ ] Define rollback strategy for failed sync logic or false-positive matcher regressions.
- [ ] Ensure every checkpoint has one primary owner and one independent reviewer.

### 2) API Architect - Contract Integrity
- [ ] Define snapshot contract fields and required semantics (`version`, `updatedAt`, `signature`, `entries`).
- [ ] Define stale/empty/invalid snapshot handling contract and expected fallback behavior.
- [ ] Define ETag and cache freshness contract (when to trust cache vs re-fetch).
- [ ] Define message boundary contract between content script and service worker.
- [ ] Define identifier precedence contract (`channelId`, `handle`, `customUrl`, `channelName`).
- [ ] Define explicit error taxonomy for sync/match failures (network, parse, validation, unavailable).

### 3) TypeScript MCP Expert - Implementation Quality
- [ ] Enforce strict typing for sync responses, message payloads, and matcher results.
- [ ] Remove or isolate permissive typing that obscures data-shape guarantees.
- [ ] Ensure shared types are single-source-of-truth and not duplicated inconsistently.
- [ ] Ensure schema validation is applied before persisting or matching snapshot data.
- [ ] Ensure channel normalization functions are deterministic and side-effect free.
- [ ] Ensure cache invalidation is triggered only by trustworthy update events.

### 4) Security Reviewer - Privacy and Threat Controls
- [ ] Verify no browsing telemetry leaves the browser during matching logic.
- [ ] Verify no unsafe trust in remote data before validation.
- [ ] Verify safe handling of malformed/hostile snapshot payloads.
- [ ] Verify remote fetch fallback does not introduce insecure data flow.
- [ ] Verify secret leakage prevention for any new config/runtime values.
- [ ] Perform dependency and supply-chain risk spot-check for touched modules.

### 5) Critical Thinking Reviewer - Assumption Challenge
- [ ] Challenge identifier matching assumptions that could create false positives.
- [ ] Challenge retries/timeouts/backoff assumptions under poor network conditions.
- [ ] Challenge fallback semantics to ensure they fail safely, not silently.
- [ ] Challenge whether "works locally" evidence is sufficient under SPA edge cases.
- [ ] Challenge any over-coupling between content script extraction and background logic.

### 6) GitHub Actions Expert - CI Gate Mapping
- [ ] Confirm `build.yml` gates this phase with build + test + lint requirements.
- [ ] Confirm no phase item is marked complete with red CI or unreviewed lint regressions.
- [ ] Define future CI hardening items linked to this phase (pinned actions, least permissions, dependency review).

## Hook-Driven Validation (Phase 2)
- [ ] Tool Guardian: no blocked destructive command attempts during implementation.
- [ ] Secrets Scanner: no hardcoded secrets introduced in changed files.
- [ ] Dependency License Checker: no blocked-license packages introduced.
- [ ] Session Logger: session events present for traceability of major changes.

## Skill Usage Gate (Phase 2)
- [ ] `javascript-typescript-jest`: test structure, mocks, and async test patterns applied.
- [ ] `security-review`: vulnerability-focused review applied to sync and matching data paths.
- [ ] `webapp-testing`: used when validating browser-integrated blacklist behavior flows.

## Test Matrix Requirements
- [ ] Unit tests for snapshot schema acceptance/rejection paths.
- [ ] Unit tests for identifier normalization (`channelId`, handle, custom URL, name).
- [ ] Unit tests for matcher direct and alias-based matches.
- [ ] Unit tests for non-match and ambiguous-input behavior.
- [ ] Integration-style checks for message flow from content script to service worker and back.
- [ ] Regression cases for stale cache, empty cache, and invalid remote payloads.

## Exit Criteria
- [ ] Blacklist sync and matcher logic satisfy contract, security, and reliability checks.
- [ ] Evidence rows for actions and handoffs are complete and append-only compliant.
- [ ] Build/test/lint/CI signals are attached as evidence for completion.
- [ ] Phase 3 can begin without unresolved Phase 2 blockers.

## Command Evidence
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
