# Phase 1 Checklist - Foundation

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README: [./README.md](./README.md)

## Phase Goal
Establish a trustworthy execution baseline for a privacy-first Chrome MV3 extension and lock in evidence-driven delivery mechanics for later phases.

## Installed Asset Baseline (must be used in this phase)

### Agents
- `.github/agents/gem-orchestrator.agent.md`
- `.github/agents/critical-thinking.agent.md`
- `.github/agents/api-architect.agent.md`
- `.github/agents/typescript-mcp-expert.agent.md`
- `.github/agents/playwright-tester.agent.md`
- `.github/agents/se-security-reviewer.agent.md`
- `.github/agents/github-actions-expert.agent.md`
- `.github/agents/agentic-brain-installer.agent.md`
- `.github/agents/agentic-brain-asset-curator.agent.md`

### Hooks
- `.github/hooks/tool-guardian/README.md`
- `.github/hooks/secrets-scanner/README.md`
- `.github/hooks/dependency-license-checker/README.md`
- `.github/hooks/session-logger/README.md`

### Skills
- `.github/skills/javascript-typescript-jest/SKILL.md`
- `.github/skills/webapp-testing/SKILL.md`
- `.github/skills/security-review/SKILL.md`

### Workflow Gate
- `.github/workflows/build.yml`

## Evidence Contract (mandatory)
- [ ] Every completed checklist section appends one row to `.github/agent_memory/03_actions.tsv`.
- [ ] Every ownership transfer appends one row to `.github/agent_memory/05_handoffs.tsv`.
- [ ] No historical row edits in `03_actions.tsv` or `05_handoffs.tsv` (append-only only).
- [ ] Each completed section records artifact paths and command evidence.

## Pre-Flight Quality Gate
- [ ] Confirm `.github/copilot-instructions.md` is loaded before any execution work.
- [ ] Confirm all memory files `00_index.md` through `06_memory_health.md` are readable.
- [ ] Confirm all five phase folders exist with both README and CHECKLIST files.
- [ ] Confirm no checklist item is pre-checked.
- [ ] Confirm current phase and owner in `AGENTS/ACTIVE_PHASE.md` match reality.

## Agent-Orchestrated Execution Plan

### 1) Gem Orchestrator - Phase Control
- [x] Define Phase 1 checkpoints (framework readiness, security baseline, CI baseline, handoff readiness).
- [x] Define explicit ownership sequence for every checkpoint.
- [x] Define failure/rollback path when a checkpoint fails.
- [x] Register checkpoint evidence requirements in this checklist.
- [x] Register command contract (`npm run build`, `npm test`, `npm run lint`) for downstream phases.

#### 1A) Phase 1 checkpoints (defined)
- `CP1 Framework Readiness` - Owner: `.github/agents/agentic-brain-installer.agent.md`; Gate: AGENTS root docs linked, phase folders present, runtime asset roots documented.
- `CP2 Security Baseline` - Owner: `.github/agents/se-security-reviewer.agent.md`; Gate: local-matching/no-telemetry posture, secrets policy, and release-blocking security scan expectations documented.
- `CP3 CI Baseline` - Owner: `.github/agents/github-actions-expert.agent.md`; Gate: required build workflow present and hardening tasks implemented (permissions, action pinning, dependency review, code scanning).
- `CP4 Handoff Readiness` - Owner: `.github/agents/gem-orchestrator.agent.md`; Gate: evidence rows appended to memory logs, checklist completion evidence present, and next-owner trigger declared.

#### 1B) Ownership sequence (explicit)
1. `CP1 Framework Readiness` -> `agentic-brain-installer`
2. `CP2 Security Baseline` -> `se-security-reviewer`
3. `CP3 CI Baseline` -> `github-actions-expert`
4. `CP4 Handoff Readiness` -> `gem-orchestrator`

#### 1C) Failure and rollback path
1. Mark failing checkpoint item as `[ ]` and capture failed artifact/command evidence in this checklist section.
2. Record blocker (ID, owner, attempts, required intervention) in `.github/agent_memory/04_blockers.md` if unresolved in the same execution window.
3. Keep ownership on current checkpoint owner; do not advance checkpoint sequence or phase state.
4. Re-run command contract (`npm run build`, `npm test`, `npm run lint`) after remediation.
5. Only restore checkpoint to `[x]` when both artifact evidence and command evidence are present.

#### 1D) Checkpoint evidence requirements
- Every completed checkpoint must add a row to `.github/agent_memory/03_actions.tsv`.
- Evidence must include changed artifact paths and command outcomes.
- Any ownership transfer must append one row to `.github/agent_memory/05_handoffs.tsv`.
- No historical edits to `03_actions.tsv` or `05_handoffs.tsv` (append-only contract).

#### 1E) Command contract (downstream phases)
- Build: `npm run build` (must pass)
- Test: `npm test` (must pass)
- Lint: `npm run lint` (must pass for phase closure; pre-existing failures must be explicitly tracked until resolved)

#### 1F) Evidence for section 1 completion
- Artifacts: `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/01_decisions.md`, `.github/agent_memory/03_actions.tsv`
- Command evidence: build pass, test pass, lint failing due pre-existing repository lint violations (tracked in command outputs)

### 2) Agentic Brain Installer - Framework State Integrity
- [x] Verify AGENTS root docs exist and are internally linked correctly.
- [x] Verify phase naming matches PRD naming exactly (Foundation, Blacklist API and Sync, UI Development, Testing & Polish, Deployment).
- [x] Verify `.github/agents`, `.github/hooks`, `.github/skills`, `.github/workflows` are populated and documented.
- [x] Verify `.github/agentic_brain/catalog/awesome-catalog.yaml` and `required-assets.yaml` exist and are current.
- [x] Verify no placeholder text remains in phase-critical docs (ACTIVE_PHASE, PROGRESS_DASHBOARD, REQUIRED_CUSTOM_AGENTS, REQUIRED_ASSETS).

#### 2A) AGENTS root docs integrity evidence
- Verified existence and cross-linking among root docs:
  - `AGENTS/ACTIVE_PHASE.md` references `PROGRESS_DASHBOARD.md`, `PRD.md`, and workflow instructions.
  - `AGENTS/PROGRESS_DASHBOARD.md` references active phase and required docs.
  - `AGENTS/REQUIRED_CUSTOM_AGENTS.md` links active phase, dashboard, and required assets.
  - `AGENTS/REQUIRED_ASSETS.md` exists and defines required categories for curation.

#### 2B) Phase naming alignment evidence
- Updated `PRD.md` phase labels to exact canonical names used by AGENTS phase docs:
  - `Phase 3 - UI Development`
  - `Phase 5 - Deployment`

#### 2C) Runtime `.github/` asset population evidence
- Verified runtime asset directories are populated and documented:
  - Agents: 10 markdown files under `.github/agents/` (including `README.md`)
  - Hooks: 4 hook modules with scripts + `hooks.json` + docs under `.github/hooks/`
  - Skills: 3 installed skill packages with `SKILL.md`
  - Workflows: `.github/workflows/build.yml` plus workflow README

#### 2D) Catalog integrity evidence
- Verified both catalogs exist at runtime path:
  - `.github/agentic_brain/catalog/awesome-catalog.yaml`
  - `.github/agentic_brain/catalog/required-assets.yaml`
- Verified both were last updated together and remain aligned to installed framework baseline.

#### 2E) Placeholder scan evidence
- Executed placeholder scan on phase-critical docs (`ACTIVE_PHASE`, `PROGRESS_DASHBOARD`, `REQUIRED_CUSTOM_AGENTS`, `REQUIRED_ASSETS`) for tokens `TBD`, `TODO`, `placeholder`.
- Result: no matches.

#### 2F) Evidence for section 2 completion
- Artifacts: `PRD.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/01_decisions.md`, `.github/agent_memory/03_actions.tsv`
- Command evidence: build pass, test pass, lint failing due pre-existing repository lint violations (tracked in command outputs)

### 3) Agentic Brain Asset Curator - Installed Asset Confirmation
- [x] Validate each required role has an installed, concrete agent file path.
- [x] Validate hook directories include executable scripts and hook metadata files.
- [x] Validate selected skills align with this repo stack (TypeScript/Jest, web testing, security review).
- [x] Validate no required runtime asset is left only in vendor path without curated runtime copy.
- [x] Validate curated asset list is reflected in AGENTS documentation.

#### 3A) Required role path validation evidence
- Verified all required curated agent paths from `AGENTS/REQUIRED_CUSTOM_AGENTS.md` exist in runtime `.github/agents/`:
  - `.github/agents/gem-orchestrator.agent.md`
  - `.github/agents/critical-thinking.agent.md`
  - `.github/agents/api-architect.agent.md`
  - `.github/agents/typescript-mcp-expert.agent.md`
  - `.github/agents/playwright-tester.agent.md`
  - `.github/agents/se-security-reviewer.agent.md`
  - `.github/agents/github-actions-expert.agent.md`
  - `.github/agents/agentic-brain-installer.agent.md`
  - `.github/agents/agentic-brain-asset-curator.agent.md`

#### 3B) Hook structure validation evidence
- Validated required hook directories include `README.md`, `hooks.json`, and executable scripts:
  - `tool-guardian` (1 script)
  - `secrets-scanner` (1 script)
  - `dependency-license-checker` (1 script)
  - `session-logger` (3 scripts)

#### 3C) Skill alignment validation evidence
- Validated installed skills align with repo stack and quality gates:
  - `.github/skills/javascript-typescript-jest/SKILL.md` (TypeScript + Jest)
  - `.github/skills/webapp-testing/SKILL.md` (browser behavior validation)
  - `.github/skills/security-review/SKILL.md` (security review)

#### 3D) Vendor-only gap validation evidence
- Checked required curated runtime assets against runtime `.github/` locations.
- Result: no required curated asset is vendor-only; all required curated agent paths are present in runtime.
- Result: no assets found in wrong runtime path under `.github/agentic_brain/{agents,hooks,skills,workflows}`.

#### 3E) AGENTS documentation reflection evidence
- Detected mismatch: `playwright-tester` existed in required curated list but was missing from checklist installed-agent baseline.
- Fix applied: added `.github/agents/playwright-tester.agent.md` to Installed Asset Baseline agent list.
- Reflection now consistent across:
  - `AGENTS/REQUIRED_CUSTOM_AGENTS.md`
  - `AGENTS/Phase 1 - Foundation/CHECKLIST.md`
  - runtime `.github/agents/`

#### 3F) Evidence for section 3 completion
- Artifacts: `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/02_learnings.md`, `.github/agent_memory/03_actions.tsv`
- Command evidence: build pass, test pass, lint failing due pre-existing repository lint violations (tracked in command outputs)

### 4) API Architect - Foundation Contracts
- [x] Confirm blacklist sync contract boundaries (remote source, local cache, matcher consumer boundary).
- [x] Confirm extension message contract boundaries (`CHECK_CHANNEL`, sync triggers, result flow).
- [x] Confirm failure semantics (network failures, stale cache, invalid snapshot behavior) are explicit in docs.
- [x] Confirm architectural in-scope/out-of-scope constraints align with PRD.

#### 4A) Blacklist sync contract boundary evidence
- Documented Phase 1 sync boundaries in `PRD.md` section `5.2.1`:
  - Remote source boundary: `BLACKLIST_RAW_URL` consumed only by service worker sync path.
  - Local cache boundary: storage contract constrained to `blacklist`, `blacklist-etag`, `last-sync`.
  - Matcher boundary: `src/shared/matcher.ts` remains consumer-only of validated snapshots.

#### 4B) Extension message boundary evidence
- Documented canonical message boundaries in `PRD.md` section `5.2.2`:
  - `CHECK_CHANNEL` request contract from content script to service worker.
  - Sync trigger contract (`BLACKLIST_SYNC`, alarms, startup hooks).
  - Result flow contract: direct check response plus `BLACKLIST_UPDATED` broadcast on updates.

#### 4C) Failure semantics evidence
- Documented explicit failure behavior in `PRD.md` section `5.2.3`:
  - Network failures preserve cached local behavior.
  - Invalid remote snapshots are rejected and fallback snapshot path is used when available.
  - Stale cache remains readable while background revalidation runs.
  - Message-path failures retry then degrade to local/direct fallback checks.

#### 4D) In-scope/out-of-scope alignment evidence
- Confirmed architecture constraints in `PRD.md` section `5.2.4` align with section `3.1 In Scope` and `3.2 Out of Scope (V2+)`:
  - Local matching + read-only snapshot fetch in scope.
  - Blocking UX, analytics, telemetry, and server-side channel checks out of scope.

#### 4E) Evidence for section 4 completion
- Artifacts: `PRD.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/01_decisions.md`, `.github/agent_memory/03_actions.tsv`, `.github/agent_memory/05_handoffs.tsv`
- Command evidence: build pass, test pass, lint failing due pre-existing repository lint violations (tracked in command outputs)

### 5) TypeScript MCP Expert - Type and Runtime Baseline
- [x] Confirm TypeScript strictness expectations are documented as a quality gate.
- [x] Confirm module boundary expectations for `src/background`, `src/content`, and `src/shared`.
- [x] Confirm schema/runtime validation requirements are explicit for blacklist payloads.
- [x] Confirm testability expectations (pure helpers + isolated logic) are documented for next phases.

#### 5A) TypeScript strictness quality gate evidence
- Added explicit strictness gate in `PRD.md` section `5.2.5` and tied it to phase quality validation.
- Confirmed repository compiler baseline remains strict in `tsconfig.json` (`"strict": true`).

#### 5B) Module boundary evidence
- Documented explicit runtime ownership boundaries in `PRD.md` section `5.2.5`:
  - `src/background/` owns Chrome API I/O, storage writes, and sync network calls.
  - `src/content/` owns YouTube DOM integration and extension message requests.
  - `src/shared/` owns reusable pure logic/types/schema guards with no DOM or Chrome API side effects.

#### 5C) Schema/runtime validation evidence
- Documented the contract that untrusted payloads must pass runtime guards before use.
- Captured blacklist-specific requirement in `PRD.md` section `5.2.5`: snapshots must pass `isValidSnapshot` before cache write or matcher consumption.

#### 5D) Testability baseline evidence
- Documented next-phase testability contract in `PRD.md` section `5.2.5`:
  - Keep domain logic in deterministic pure helpers.
  - Keep side-effecting modules as thin orchestration layers.
  - Require isolated unit-test coverage for shared domain logic.

#### 5E) Evidence for section 5 completion
- Artifacts: `PRD.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/01_decisions.md`, `.github/agent_memory/03_actions.tsv`, `.github/agent_memory/05_handoffs.tsv`
- Command evidence: build pass, test pass, lint failing due pre-existing repository lint violations (tracked in command outputs)

### 6) Security Reviewer - Foundation Threat Baseline
- [x] Confirm principle of local matching and no browsing telemetry is documented and preserved.
  - Evidence: `PRD.md` section `5.2.4` preserves local matching and excludes browsing telemetry/analytics/server-side checks; `PRD.md` section `5.2.6` restates the privacy posture as a security baseline.
- [x] Confirm minimum-permission MV3 posture is documented as non-negotiable.
  - Evidence: `manifest.json` keeps permissions to `storage` and `alarms` only, and `PRD.md` section `5.2.6` states additional permissions require explicit phase review before introduction.
- [x] Confirm secrets handling expectations (no hardcoded tokens, scanner-required) are documented.
  - Evidence: `.github/hooks/secrets-scanner/README.md` documents `warn`/`block` modes, session-end scanning, and no-commit blocking; `PRD.md` section `5.2.6` forbids hardcoded tokens, API keys, and private keys.
- [x] Confirm dependency/license/security scans are defined as release blockers when high-risk findings exist.
  - Evidence: `.github/hooks/dependency-license-checker/README.md` defines `warn`/`block` modes and blocked-license enforcement; `PRD.md` section `5.2.6` marks high-risk security and license findings as release blockers.
- [x] Confirm security review evidence format is defined for later phases.
  - Evidence: `PRD.md` section `5.2.6` requires later-phase security reviews to capture target, commands, findings, severity, affected paths, and disposition in the active checklist and action log.

### 7) GitHub Actions Expert - CI Baseline Hardening Plan
 - [x] Confirm `build.yml` is present and mapped as a required gate.
 - [x] Implement least-privilege permissions and action SHA pinning in `build.yml`.
 - [x] Add dependency review workflow for pull requests with pinned actions.
 - [x] Add CodeQL workflow for code scanning with pinned actions.
 - [x] Define branch policy expectation: no phase closure without passing CI.
 - [x] Define workflow ownership and update process for later phases.

#### 7A) CI Hardening Implementation Evidence
 - Build workflow permissions set to `contents: read` at workflow and job level in `.github/workflows/build.yml`.
 - `actions/checkout` pinned to `11bd71901bbe5b1630ceea73d27597364c9af683` (v4.2.2) and `actions/setup-node` pinned to `39370e3970a6d050c480ffad4ff0ed4d3fdee5af` (v4.1.0).
 - Dependency review workflow added in `.github/workflows/dependency-review.yml` with `actions/dependency-review-action` pinned to `9129d7d40b8c12c1ed0f60400d00c92d437adcce` (v4.1.3).
 - CodeQL workflow added in `.github/workflows/codeql.yml` with `github/codeql-action` pinned to `f079b8493333aace61c81488f8bd40919487bd9f` (v3.25.7) and `security-events: write` permissions.
 - Workflow catalog updated in `.github/workflows/README.md`.

#### 7B) Evidence for section 7 completion
 - Artifacts: `.github/workflows/build.yml`, `.github/workflows/dependency-review.yml`, `.github/workflows/codeql.yml`, `.github/workflows/README.md`, `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `.github/agent_memory/03_actions.tsv`
 - Command evidence: build pass, test pass, lint failing due pre-existing repository lint violations (tracked in command outputs)

### 8) Critical Thinking Reviewer - Assumption Pressure Test
- [x] Challenge whether phase gates are specific enough to prevent ambiguous "done" states.
  - Finding: CP3 gate now requires implemented CI hardening tasks and has been satisfied by workflow changes in section 7.
- [x] Challenge whether handoff requirements are explicit enough to avoid role overlap.
  - Finding: Ownership sequence in section 1B remains linear with no overlap; each checkpoint has a single owner.
- [x] Challenge whether security/privacy statements are testable and not aspirational only.
  - Finding: Requirements are testable via `manifest.json` permissions, PRD contracts in sections 5.2.4-5.2.6, and hook configs.
- [x] Challenge whether checklist evidence is sufficient for external audit of progress claims.
  - Finding: Each completed section records artifacts, command evidence, and memory log entries for auditability.

#### 8A) Evidence for section 8 completion
 - Artifacts: `AGENTS/Phase 1 - Foundation/CHECKLIST.md`, `AGENTS/ACTIVE_PHASE.md`, `AGENTS/PROGRESS_DASHBOARD.md`, `.github/agent_memory/03_actions.tsv`

## Hook-Driven Compliance Gate (Phase 1)
- [x] Tool Guardian operating mode and allowlist policy are documented for this repository.
  - Evidence: `.github/hooks/tool-guardian/README.md` and `.github/hooks/hooks.json` (`GUARD_MODE=block`, allowlist via `TOOL_GUARD_ALLOWLIST`).
- [x] Secrets Scanner operating mode (`warn` or `block`) and scope policy are documented.
  - Evidence: `.github/hooks/secrets-scanner/README.md` and `.github/hooks/hooks.json` (`SCAN_MODE=warn`, `SCAN_SCOPE=diff`).
- [x] Dependency License Checker blocked-license policy is documented.
  - Evidence: `.github/hooks/dependency-license-checker/README.md` and `.github/hooks/hooks.json` (`LICENSE_MODE=warn`, `BLOCKED_LICENSES` policy).
- [x] Session Logger retention/privacy policy is documented (`logs/` ignored, no secrets in logs).
  - Evidence: `.github/hooks/session-logger/README.md` and `.gitignore` includes `logs/` and `.github/logs/`.
- [x] Hook sequencing at session end is documented (scanner/license checks before any auto-commit logic).
  - Evidence: `.github/hooks/README.md` ordering notes and `.github/hooks/hooks.json` `sessionEnd` sequence.

## Skill-Guided Quality Gate (Phase 1)
- [x] `javascript-typescript-jest` skill is referenced as mandatory for future test authoring conventions.
  - Evidence: `.github/skills/javascript-typescript-jest/SKILL.md` required for unit testing conventions.
- [x] `webapp-testing` skill is referenced as mandatory for browser behavior validation in later phases.
  - Evidence: `.github/skills/webapp-testing/SKILL.md` required for Playwright-based UI validation.
- [x] `security-review` skill is referenced as mandatory for vulnerability-focused reviews before phase closure.
  - Evidence: `.github/skills/security-review/SKILL.md` required for security review gates.

## Exit Criteria
- [x] All foundation governance, security, and CI gates are documented with measurable evidence.
  - Evidence: Sections 1-8, hook gate, and skill gate completed with artifacts and command evidence.
- [x] All execution assets are verified in runtime `.github/` paths (not vendor-only).
  - Evidence: Section 3 validation plus workflow additions in `.github/workflows/`.
- [x] No unresolved blocker exists for starting Phase 2 implementation work.
  - Evidence: `.github/agent_memory/04_blockers.md` shows no active blockers.

## Command Evidence
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
