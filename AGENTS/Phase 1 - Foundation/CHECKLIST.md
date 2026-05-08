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
- [ ] Verify AGENTS root docs exist and are internally linked correctly.
- [ ] Verify phase naming matches PRD naming exactly (Foundation, Blacklist API and Sync, UI Development, Testing & Polish, Deployment).
- [ ] Verify `.github/agents`, `.github/hooks`, `.github/skills`, `.github/workflows` are populated and documented.
- [ ] Verify `.github/agentic_brain/catalog/awesome-catalog.yaml` and `required-assets.yaml` exist and are current.
- [ ] Verify no placeholder text remains in phase-critical docs (ACTIVE_PHASE, PROGRESS_DASHBOARD, REQUIRED_CUSTOM_AGENTS, REQUIRED_ASSETS).

### 3) Agentic Brain Asset Curator - Installed Asset Confirmation
- [ ] Validate each required role has an installed, concrete agent file path.
- [ ] Validate hook directories include executable scripts and hook metadata files.
- [ ] Validate selected skills align with this repo stack (TypeScript/Jest, web testing, security review).
- [ ] Validate no required runtime asset is left only in vendor path without curated runtime copy.
- [ ] Validate curated asset list is reflected in AGENTS documentation.

### 4) API Architect - Foundation Contracts
- [ ] Confirm blacklist sync contract boundaries (remote source, local cache, matcher consumer boundary).
- [ ] Confirm extension message contract boundaries (`CHECK_CHANNEL`, sync triggers, result flow).
- [ ] Confirm failure semantics (network failures, stale cache, invalid snapshot behavior) are explicit in docs.
- [ ] Confirm architectural in-scope/out-of-scope constraints align with PRD.

### 5) TypeScript MCP Expert - Type and Runtime Baseline
- [ ] Confirm TypeScript strictness expectations are documented as a quality gate.
- [ ] Confirm module boundary expectations for `src/background`, `src/content`, and `src/shared`.
- [ ] Confirm schema/runtime validation requirements are explicit for blacklist payloads.
- [ ] Confirm testability expectations (pure helpers + isolated logic) are documented for next phases.

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
