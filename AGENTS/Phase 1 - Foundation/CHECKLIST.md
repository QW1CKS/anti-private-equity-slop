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
- `CP3 CI Baseline` - Owner: `.github/agents/github-actions-expert.agent.md`; Gate: required build workflow present and hardening roadmap (permissions, pinning, dependency/code scanning) documented.
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
- [ ] Confirm principle of local matching and no browsing telemetry is documented and preserved.
- [ ] Confirm minimum-permission MV3 posture is documented as non-negotiable.
- [ ] Confirm secrets handling expectations (no hardcoded tokens, scanner-required) are documented.
- [ ] Confirm dependency/license/security scans are defined as release blockers when high-risk findings exist.
- [ ] Confirm security review evidence format is defined for later phases.

### 7) GitHub Actions Expert - CI Baseline Hardening Plan
- [ ] Confirm `build.yml` is present and mapped as a required gate.
- [ ] Define future hardening tasks: least-privilege permissions, action SHA pinning, dependency review, and code scanning.
- [ ] Define branch policy expectation: no phase closure without passing CI.
- [ ] Define workflow ownership and update process for later phases.

### 8) Critical Thinking Reviewer - Assumption Pressure Test
- [ ] Challenge whether phase gates are specific enough to prevent ambiguous "done" states.
- [ ] Challenge whether handoff requirements are explicit enough to avoid role overlap.
- [ ] Challenge whether security/privacy statements are testable and not aspirational only.
- [ ] Challenge whether checklist evidence is sufficient for external audit of progress claims.

## Hook-Driven Compliance Gate (Phase 1)
- [ ] Tool Guardian operating mode and allowlist policy are documented for this repository.
- [ ] Secrets Scanner operating mode (`warn` or `block`) and scope policy are documented.
- [ ] Dependency License Checker blocked-license policy is documented.
- [ ] Session Logger retention/privacy policy is documented (`logs/` ignored, no secrets in logs).
- [ ] Hook sequencing at session end is documented (scanner/license checks before any auto-commit logic).

## Skill-Guided Quality Gate (Phase 1)
- [ ] `javascript-typescript-jest` skill is referenced as mandatory for future test authoring conventions.
- [ ] `webapp-testing` skill is referenced as mandatory for browser behavior validation in later phases.
- [ ] `security-review` skill is referenced as mandatory for vulnerability-focused reviews before phase closure.

## Exit Criteria
- [ ] All foundation governance, security, and CI gates are documented with measurable evidence.
- [ ] All execution assets are verified in runtime `.github/` paths (not vendor-only).
- [ ] No unresolved blocker exists for starting Phase 2 implementation work.

## Command Evidence
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
